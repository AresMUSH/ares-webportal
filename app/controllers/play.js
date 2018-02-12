import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    connected: false,
    consoleText: '',
    text1: '',
    text2: '',
    windowVisible: true,
    notifications: service(),
    messages: [],
    
    idleKeepalive: function() {
        if (this.get('connected')) {
            this.sendInput("keepalive");
        }
        else {
            clearInterval(this.get('keepaliveInterval'));
        }
    },
    
    onMessage: function(evt) {
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
        
        let html = ansi_up.ansi_to_html(data.args.message);
        this.get('messages').pushObject(html);
          
        $('#console').stop().animate({
            scrollTop: $('#console')[0].scrollHeight
        }, 800);           
        
        this.get('notifications').changeFavicon(true);

        if (!this.get('windowVisible')) {
            if (this.get('browserNotification') && this.get('browserNotification.permission') === "granted") {
                new Notification(`Activity in ${aresconfig.mu_name}!`);
            }            
        }
    },
    onConnect: function(self) {
        document.getElementById("sendMsg").focus();
        self.set('connected', true);   
	self.set('messages', []);     
    },
    onDisconnect: function(self) {
        self.set('connected', false);
    },
    showDisconnect: function() {
        return this.get('connected');
    }.property('connected'),
    
    showConnect: function() {  
        return !this.get('connected');
    }.property('connected'),
    
    sendInput: function(msg) {
        var cmd, json;
        cmd = {
            'type': 'input',
            'message': msg.trim()
        };
        json = JSON.stringify(cmd);
        this.get('websocket').send(json);
    },
    
    
    actions: {
        connect() {
            var idle_keepalive_ms = 60000;
            this.set('websocket', new WebSocket(`ws://${aresconfig.host}:${aresconfig.websocket_port}/websocket`));
                var self = this;
                this.get('websocket').onmessage = function(evt) { 
                    self.onMessage(evt);
                };
                this.get('websocket').onclose = function() {
                    self.onDisconnect(self);
                };
                this.get('websocket').onopen = function() {
                    self.onConnect(self);
                };
                
                // Blur is the event that gets triggered when the window becomes active.
                $(window).blur(function(){
                    self.set('windowVisible', false);
                });
                $(window).focus(function(){
                    self.set('windowVisible', true);
                    self.get('notifications').changeFavicon(false);                    
                });
                this.set('browserNotification', window.Notification || window.mozNotification || window.webkitNotification);
            
                if (this.get('browserNotification')) {
                    this.get('browserNotification').requestPermission();
                }
                
                this.get('keepaliveInterval', window.setInterval(function(){ self.idleKeepalive() }, idle_keepalive_ms));

                
            },
            disconnect() {
                this.sendInput('quit');
            },
            sendMsg1() {
                this.sendInput(this.get('text1'));
                this.set('text1', '');
            },
            sendMsg2() {
                this.sendInput(this.get('text2'));
                this.set('text2', '');
            }
        }
    });
