import Service from '@ember/service';
import { inject as service } from '@ember/service';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Service.extend(AresConfig, {
    session: service(),
    router: service(),
    flashMessages: service(),
    favicon: service(),
    
    socket: null,
    charId: null,
    callbacks: null,
    connected: false,
    lastActivity: null,
  
    init: function() {
      this._super(...arguments);
      this.set('callbacks', {});
    },
      
    socketUrl() {
      let protocol = this.httpsEnabled ? 'wss' : 'ws';
      return `${protocol}://${this.mushHost}:${this.websocketPort}/websocket`;
    },
    
    checkSession(charId) {
        let socket = this.socket;
        if (!socket || this.charId != charId) {
            this.sessionStarted(charId);
        }
    },
    
    isWindowFocused() {
      return document.hasFocus();
    },
    
    highlightFavicon() {
      if (!this.isWindowFocused()) {
        this.favicon.changeFavicon(true);
      }
    },
    
    // Regular alert notification
    notify(msg) {
      
      var doc = new DOMParser().parseFromString(msg, 'text/html');
      var cleanMsg =  doc.body.textContent || "";

        if (this.browserNotification && this.get('browserNotification.permission') === "granted") {
            try {
              new Notification(`Activity in ${this.mushName}`, 
                {
                  icon: '/game/uploads/theme_images/notification.png',
                  badge: '/game/uploads/theme_images/notification.png',
                  body: cleanMsg,
                  tag: this.mushName,
                  renotify: true
                }
               ); 
            }
            catch(error) {
                // Do nothing.  Just safeguard against missing browser notification.
            }
        }         
        
       if (!this.isWindowFocused()) {
            this.favicon.changeFavicon(true);
        }
    },
    
    reconnect() {
      console.log("Reconnecting websocket.");
      this.sessionStarted(this.charId);
    },
    
    sessionStarted(charId) {
      
      if (this.aresconfig === null) {
        console.log("Unable to open websocket - aresconfig is missing.");
        return;
      }
      
        let socket = this.socket;
        this.set('charId', charId);
        
        if (socket) {
          this.handleConnect();
          return;
        }
        
        try
        {
            socket = new WebSocket(this.socketUrl());
            this.set('socket', socket);
            let self = this;
            socket.onopen = function() {
                self.handleConnect();
            };
            socket.onmessage = function(evt) {
                self.handleMessage(self, evt);
            };
            socket.onclose = function() {
              self.handleError(self, 'Websocket closed.');
            };
            socket.onError = function(evt) {
              self.handleError(self, evt);
            };
            this.set('browserNotification', window.Notification || window.mozNotification || window.webkitNotification);
        
            if (this.browserNotification) {
                this.browserNotification.requestPermission();
            }
        }
        catch(error)
        {
            console.log(`Error loading websocket: ${error}`);
        }
    },
    
    sessionStopped() {
        this.set('charId', null);
        this.sendCharId();
        /*
        
        let socket = this.get('socket');
            if (socket) {
            socket.close();
            this.set('socket', null);
        }*/
    },
    
    sendCharId() {
      let cmd = {
        'type': 'identify',
        'data': { 'id': this.charId }
      };
      let json = JSON.stringify(cmd);
      try {
        let socket = this.socket;
        if (socket) {
          socket.send(json); 
        }
      }
      catch(err) {
        // Socket closed already.
      }
       
    },
    
    removeCallback( notification ) {
      delete this.callbacks[notification];
    },
    
    setupCallback( notification, method ) {
      this.callbacks[notification] = method;
    },
    
    handleError(self, evt) {
      let message = 'Your connection to the game has been lost!  You will no longer see updates.  Try reloading the page.  If the problem persists, the game may be down.';
      console.error("Websocket closed: ", evt);
      self.notify(message, 10, 'error');
      self.set('connected', false);
      self.set('socket', null);
      setTimeout(() => self.reconnect(), 5000);      
    },
    
    handleConnect() {
      this.set('connected', true);
      this.set('lastActivity', new Date());
      this.sendCharId();
    },
    
    updateNotificationBadge(count) {
      var notificationBadge = document.getElementById('notificationBadge');
      if (notificationBadge) {
        notificationBadge.textContent = (`${count}` === '0' ? '' : count);
      }
    },
    
    handleMessage(self, evt) {
        
        var data;
        
        try
        {
           data = JSON.parse(evt.data);
        }
        catch(e)
        {
            data = null;
        }
        
        if (!data) {
            return;
        }
        
        var recipient = data.args.character;
        var notification_type = data.args.notification_type;

        
        if (notification_type == "ping") {
          this.set('lastActivity', new Date());
          console.log("PING " + new Date().toLocaleString());
          return;
        }
        
        if (!recipient || recipient === self.get('charId')) {
            var notify = true;
            
            if (this.callbacks[notification_type]) {
              this.callbacks[notification_type](notification_type, data.args.message, data.args.timestamp);
              notify = false;
            }
            
            if (data.args.is_data) {
              notify = false;
            }
              
            if (notification_type == "notification_update") {
              this.updateNotificationBadge(data.args.message);
              notify = false;
            }
            
            if (notify) {
                var formatted_msg = ansi_up.ansi_to_html(data.args.message, { use_classes: true });
              this.notify(formatted_msg);
            }
        }
        
    }
});
