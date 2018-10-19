import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
    session: service(),
    routing: service('-routing'),
    flashMessages: service(),
    favicon: service(),
    
    windowVisible: true,
    socket: null,
    charId: null,
    chatCallback: null,
    sceneCallback: null,
    sidebarCallback: null,
    
    socketUrl() {
        return `ws://${window.location.host}:${aresconfig.websocket_port}/websocket`;
    },
    
    checkSession(charId) {
        let socket = this.get('socket');
        if (!socket || this.get('charId') != charId) {
            this.sessionStarted(charId);
        }
    },
    
    // Regular alert notification
    notify(msg, type = 'success') {
        
        if (this.get('windowVisible')) {
            if (msg) {
               alertify.notify(msg, type, 10);
            }
        }
        else {
            if (this.get('browserNotification') && this.get('browserNotification.permission') === "granted") {
                this.get('favicon').changeFavicon(true);
                try {
                    new Notification(`Activity in ${aresconfig.game_name}!`);
                }
                catch(error) {
                    // Do nothing.  Just safeguard against missing browser notification.
                }
            }            
        }
    },
    
    sessionStarted(charId) {
        let socket = this.get('socket');
        this.set('charId', charId);
        
        if (socket) {
            socket.close();
        }
        
        try
        {
            socket = new WebSocket(this.socketUrl());
            this.set('socket', socket);
            let self = this;
            socket.onopen = function() {
                self.handleConnect(self);
            };
            socket.onmessage = function(evt) {
                self.handleMessage(self, evt);
            };
            
            this.set('browserNotification', window.Notification || window.mozNotification || window.webkitNotification);
        
            if (this.get('browserNotification')) {
                this.get('browserNotification').requestPermission();
            }
        }
        catch(error)
        {
            console.log(`Error loading websocket: ${error}`);
        }
    },
    
    sessionStopped() {
        let socket = this.get('socket');
        this.set('charId', null);
        if (socket) {
            socket.close();
            this.set('socket', null);
        }
    },
    
    handleConnect(self) {
        let cmd = {
          'type': 'identify',
          'data': { 'id': self.get('charId') }
        };
        let json = JSON.stringify(cmd);
        
        // Blur is the event that gets triggered when the window becomes active.
        $(window).blur(function(){
            self.set('windowVisible', false);
        });
        $(window).focus(function(){
            self.set('windowVisible', true);
            self.get('favicon').changeFavicon(false);                    
        });

        return self.get('socket').send(json);
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
            if (notification_type == "new_mail") {
                var mail_badge = $('#mailBadge');
                var mail_count = mail_badge.text();
                mail_count = parseInt( mail_count );
                mail_badge.text(mail_count + 1);
                
            }
            else if (notification_type == "new_chat") {
                if (this.get('chatCallback')) {
                    this.get('chatCallback')(data.args.message);
                }
                notify = false;
            }
            else if (notification_type == "new_scene_activity") {
                if (this.get('sidebarCallback')) {
                    this.get('sidebarCallback')();
                }                
                if (this.get('sceneCallback')) {
                    if (!this.get('windowVisible')) {
                      this.get('favicon').changeFavicon(true);    
                    }
                    this.get('sceneCallback')(data.args.message);
                }
                notify = false;
            }
            
            if (notify) {
                this.notify(formatted_msg);
            }
        }
        
    }
    
    
});
