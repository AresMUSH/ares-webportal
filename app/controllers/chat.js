import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameSocket: service(),
    favicon: service(),
    gameApi: service(),
    selectedChannel: '',
    chatMessage: '',
    
    onChatMessage: function(msg) {
        let splitMsg = msg.split('|');
        let channelKey = splitMsg[0];
        
        this.get('gameApi').requestOne('chat').then( response => {
            if (!this.get('gameSocket.windowVisible')) {
                this.get('favicon').changeFavicon(true);
            }
            this.set(`model.channels.${channelKey}.messages`, response.get(`channels.${channelKey}.messages`))
            this.set(`model.channels.${channelKey}.who`, response.get(`channels.${channelKey}.who`))
            if (channelKey === this.get('selectedChannel').toLowerCase()) {
                this.scrollChatWindow();
            }
            else {
                let messageCount = this.get(`model.channels.${channelKey}.new_messages`) || 0;
                this.set(`model.channels.${channelKey}.new_messages`, messageCount + 1);
            }
            this.get('gameSocket').notify('New chat activity!');
            
        });                
    },
    
    scrollChatWindow: function() {
        let chatWindow = $('#chat-window')[0];
        if (chatWindow) {
            $('#chat-window').stop().animate({
                scrollTop: chatWindow.scrollHeight
            }, 800);    
        }
        
    },
    
    setupCallback: function() {
        let self = this;
        this.get('gameSocket').set('chatCallback', function(channel) {
            self.onChatMessage(channel) } );
    },
    
    getCurrentChannelKey: function() {
        let channelName = this.get('selectedChannel');
        if (channelName) {
            return channelName.toLowerCase();
        }
        return null;
    },
    
    actions: {
        scrollDown: function() {
            this.scrollChatWindow();
        },
        
        changeChannel: function(channel) {
            this.set('selectedChannel', channel);
            let channelKey = channel.toLowerCase();
            this.set(`model.channels.${channelKey}.new_messages`, null);
        },
        
        joinChannel: function() {
            let api = this.get('gameApi');
            let channelName = this.get('selectedChannel');
                        
            api.requestOne('joinChannel', { channel: channelName }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        leaveChannel: function() {
            let api = this.get('gameApi');
            let channelName = this.get('selectedChannel');
                        
            api.requestOne('leaveChannel', { channel: channelName }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        muteChannel: function(mute) {
            let api = this.get('gameApi');
            let channelName = this.get('selectedChannel');
                        
            api.requestOne('muteChannel', { channel: channelName, mute: mute }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        send: function() {
            let api = this.get('gameApi');
            let channelName = this.get('selectedChannel');
            let message = this.get('chatMessage');
            this.set(`chatMessage`, '');
                        
            api.requestOne('chatTalk', { channel: channelName, message: message }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
            });
        }
    }
    
});