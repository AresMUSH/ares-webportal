import $ from "jquery"
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Service.extend(AresConfig, {
    session: service(),
    router: service(),
    flashMessages: service(),
    favicon: service(),
    
    windowVisible: true,
    socket: null,
    charId: null,
    callbacks: null,
    connected: false,

    init: function() {
      this._super(...arguments);
      this.set('callbacks', {});
    },
      
    socketUrl() {
      var protocol = aresconfig.use_https ? 'wss' : 'ws';
      return `${protocol}://${aresconfig.host}:${aresconfig.websocket_port}/websocket`;
    },
    
    checkSession(charId) {
        let socket = this.socket;
        if (!socket || this.charId != charId) {
            this.sessionStarted(charId);
        }
    },
    
    highlightFavicon() {
      if (!this.windowVisible) {
        this.favicon.changeFavicon(true);
      }
    },
    
    // Regular alert notification
    notify(msg, timeOutSecs = 10, type = 'success') {
        
        if (msg) {
          alertify.notify(msg, type, timeOutSecs);
        }
             
       if (!this.windowVisible) {
            this.favicon.changeFavicon(true);
            if (this.browserNotification && this.get('browserNotification.permission') === "granted") {
                try {
                  var doc = new DOMParser().parseFromString(msg, 'text/html');
                  var cleanMsg =  doc.body.textContent || "";
                     
                  new Notification(`Activity in ${aresconfig.game_name}`, 
                    {
                      icon: '/game/uploads/theme_images/notification.png',
                      badge: '/game/uploads/theme_images/notification.png',
                      body: cleanMsg,
                      tag: window.aresconfig.game_name,
                      renotify: true
                    }
                   ); 
                }
                catch(error) {
                    // Do nothing.  Just safeguard against missing browser notification.
                }
            }            
        }
    },
    
    sessionStarted(charId) {
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
              let message = 'Your connection to the game has been lost!  You will no longer see updates.  Try reloading the page.  If the problem persists, the game may be down.';
              self.notify(message, 5, 'error');
              self.set('connected', false);
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
    
    handleConnect() {
      let self = this;
        // Blur is the event that gets triggered when the window becomes active.
        $(window).blur(function(){
            self.set('windowVisible', false);
        });
        $(window).focus(function(){
            self.set('windowVisible', true);
            self.get('favicon').changeFavicon(false);                    
        });
        this.set('connected', true);
        this.sendCharId();
    },
    
    updateMailBadge(count) {
      var mail_badge = $('#mailBadge');
      mail_badge.text(count);
    },
    
    updateJobsBadge(count) {
      var job_badge = $('#jobBadge');
      job_badge.text(count);
    },
    
    updateNotificationBadge(count) {
      var notification_badge = $('#notificationBadge');
      notification_badge.text(count);
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
        
        if (notification_type == "webclient_output") {
            return;
        }
        
        if (!recipient || recipient === self.get('charId')) {
            var formatted_msg = ansi_up.ansi_to_html(data.args.message, { use_classes: true });
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
                this.notify(formatted_msg);
            }
        }
        
    }
});
