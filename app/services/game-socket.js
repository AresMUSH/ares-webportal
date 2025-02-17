import Service from '@ember/service';
import { inject as service } from '@ember/service';
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
  
    init: function() {
      this._super(...arguments);
      this.set('callbacks', {});
    },
      
    streamUrl(charId) {
      let url = `${this.gameApi.serverUrl()}/api/events/${charId || -1}`;
      return url;
    },
    
    checkSession(charId) {
        if (!this.connected || this.charId != charId) {
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
    
    sessionStarted(charId) {
      
      if (this.aresconfig === null) {
        console.log("Unable to open event stream - aresconfig is missing.");
        return;
      }
      
      this.set('charId', charId);
      
      if (this.eventSource) {
        this.eventSource.close();        
      }
      
      try {
        const sourceUrl  = this.streamUrl(charId);
        const source = new EventSource(sourceUrl);
      
        this.set('eventSource', source);
       
        let self = this;
        source.onopen = function() {
          self.set('connected', true);
          console.log("Event stream open at " + new Date().toLocaleString());
        };
        source.onerror = function(evt) {
          self.handleError(self, evt);
        };
        source.addEventListener('message', function(evt) {
            self.handleMessage(self, evt);
        });
        this.set('browserNotification', window.Notification || window.mozNotification || window.webkitNotification);
    
        if (this.browserNotification) {
            this.browserNotification.requestPermission();
        }
      }
      catch(error)
      {
          console.log(`Error opening event stream: ${error}`);
      }
    },
    
    sessionStopped() {
      // Stopping a session is just restarting it with no character ID.
      this.sessionStarted(null);
    },
    
    removeCallback( notification ) {
      delete this.callbacks[notification];
    },
    
    setupCallback( notification, method ) {
      this.callbacks[notification] = method;
    },
    
    handleError(self, evt) {
      let message = 'Your connection to the game has been lost!  You will no longer see updates.  Try reloading the page.  If the problem persists, the game may be down.';
      console.error(`${new Date().toLocaleString()} Event stream closed.`, evt);
      self.notify(message, 10, 'error');
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
