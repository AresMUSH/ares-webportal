import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
    flashMessages: service(),
    session: service(),
    routing: service('-routing'),
    
    socket: null,
    charId: null,
    chatCallback: null,
    sceneCallback: null,
    
    socketUrl() {
        return `ws://${aresconfig.host}:${aresconfig.websocket_port}/websocket`;
    },
    
    checkSession(charId) {
        let socket = this.get('socket');
        if (!socket || this.get('charId') != charId) {
            this.sessionStarted(charId);
        }
    },
    
    changeFavicon(active) {
        var src = '/game/uploads/theme_images/favicon.ico';
        if (active) { 
            src = '/game/uploads/theme_images/faviconactive.ico';
        }
        $('link[rel="shortcut icon"]').attr('href', src);
    },
     
    notify(msg, type = 'success') {
        alertify.notify(msg, type, 10);
    },
    
    sessionStarted(charId) {
        let socket = this.get('socket');
        this.set('charId', charId);
        
        if (socket) {
            socket.close();
        }
        
        socket = new WebSocket(this.socketUrl());
        this.set('socket', socket);
        let self = this;
        socket.onopen = function() {
            self.handleConnect(self);
        };
        socket.onmessage = function(evt) {
            self.handleMessage(self, evt);
        };
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

        if (!recipient || recipient === self.get('charId')) {
            var formatted_msg = ansi_up.ansi_to_html(data.args.message, { use_classes: true });
            var notify = true;
            if (data.args.notification_type == "new_mail") {
                var mail_badge = $('#mailBadge');
                var mail_count = mail_badge.text();
                mail_count = parseInt( mail_count );
                mail_badge.text(mail_count + 1);
                
            }
            else if (data.args.notification_type == "new_chat") {
                if (this.get('chatCallback')) {
                    this.get('chatCallback')(data.args.message);
                }
                notify = false;
            }
            else if (data.args.notification_type == "new_scene_activity") {
                if (this.get('sceneCallback')) {
                    this.get('sceneCallback')(data.args.message);
                }
                notify = false;
            }
            
            if (notify) {
                alertify.notify(formatted_msg, 'success', 10);
            }
        }
        
    }
    
    
});
