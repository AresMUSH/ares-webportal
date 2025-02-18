import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Service.extend(AresConfig, {
    session: service(),
    router: service(),
    flashMessages: service(),
    favicon: service(),
    gameApi: service(),
    
    charId: null,
    callbacks: null,
    eventSource: null,
    connected: false,
    notReceivingGameUpdates: false,
    connecting: false,
  
    init: function() {
      this._super(...arguments);
      this.set('callbacks', {});
    },
    
    streamUrl(charId) {
      let url = `${this.gameApi.serverUrl()}/api/events/${charId || -1}`;
      return url;
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
    
    checkForConnectionDown() {
      
      let self = this;
      
      setTimeout(function() {
        if (!self.connected) {
          self.set('notReceivingGameUpdates', true);
          let message = 'Your connection to the game has been lost!  You will no longer see updates.  Try reloading the page.  If the problem persists, the game may be down.';
          self.notify(message, 10, 'error');
          console.log(message);
        }
      }, 15000);  
    },
    
    startSession(charId) {
      
      if (this.aresconfig === null) {
        console.log("Unable to open event stream - aresconfig is missing.");
        return;
      }
      
      if (this.connected || this.connecting) {
        if (this.charId != charId) {
          console.log("Switching event connection to new character.");
          this.set('connected', false);
          this.set('connecting', false);          
          this.eventSource.close();
        } else {
          console.log("Double event connection attempt.");
          return;
        }
      }      
      
      this.set('charId', charId);

      try {
        this.set('connecting', true);
        this.checkForConnectionDown();
        const sourceUrl  = this.streamUrl(charId);
        const source = new EventSource(sourceUrl);
      
        this.set('eventSource', source);
        
        
        let self = this;
        
        
        source.onopen = function() {
          self.set('connecting', false);
          self.set('connected', true);
          self.set('notReceivingGameUpdates', false);
          console.log("Event stream open at " + new Date().toLocaleString());          
        };
        source.onerror = function(evt) {
          self.set('connecting', false);
          self.handleError(self, evt);
        };        
        source.addEventListener('message', function(evt) {
          self.handleMessage(self, evt);
        });
        window.addEventListener("beforeunload", function() {
          console.log("Window unloading");
          if (self.eventSource) {
            self.eventSource.close();
          }
        });
        
        this.set('browserNotification', window.Notification || window.mozNotification || window.webkitNotification);
    
        if (this.browserNotification) {
            this.browserNotification.requestPermission();
        }
      }
      catch(error)
      {
        console.log(`Error opening event stream: ${error}`);
        this.set('connecting', false);
        this.set('connected', false);          
        this.set('notReceivingGameUpdates', true);
      }
    },
    
    sessionStopped() {
      // Stopping a session is just restarting it with no character ID.
      this.startSession(null);
    },
    
    removeCallback( notification ) {
      delete this.callbacks[notification];
    },
    
    setupCallback( notification, method ) {
      this.callbacks[notification] = method;
    },
    
    handleError(self, evt) {
      this.checkForConnectionDown();
      console.error(`${new Date().toLocaleString()} Event stream closed.`, evt);
      self.set('connected', false);
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
        
        if (!data || data.length <= 1) {
            return;
        }
        
        var recipient = data.args.character;
        var notification_type = data.args.notification_type;
        
        if (notification_type == "webclient_output") {
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
