import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameSocket: service(),
    favicon: service(),
    gameApi: service(),
    selectedChannel: '',
    chatMessage: '',
    
    appendChatMessage: function(channel, message) {
        let channelKey = channel.toLowerCase();
        let messages = this.get(`model.channels.${channelKey}.messages`);
        messages.pushObject(message);  
    },
    
    onChatMessage: function(msg) {
        let splitMsg = msg.split('|');
        let channelKey = splitMsg[0];
        let message = splitMsg[1];
        
        this.appendChatMessage(channelKey, message);
        this.get('favicon').changeFavicon(true);                    
                
        if (channelKey === this.get('selectedChannel').toLowerCase()) {
            this.scrollChatWindow();
        }
        else {
            let messageCount = this.get(`model.channels.${channelKey}.new_messages`) || 0;
            this.set(`model.channels.${channelKey}.new_messages`, messageCount + 1);
        }
        this.get('gameSocket').notify('New chat activity!');
    },
    
    scrollChatWindow: function() {
        $('#chat-window').stop().animate({
            scrollTop: $('#chat-window')[0].scrollHeight
        }, 800);    
    },
    
    setupCallback: function() {
        let self = this;
        this.get('gameSocket').set('chatCallback', function(channel) {
            self.onChatMessage(channel) } );
    },
    
    actions: {
        changeChannel: function(channel) {
            this.set('selectedChannel', channel);
            this.scrollChatWindow();
            let channelKey = channel.toLowerCase();
            this.set(`model.channels.${channelKey}.new_messages`, null);
        },
        
        send: function() {
            let api = this.get('gameApi');
            api.requestOne('chatTalk', { channel: this.get('selectedChannel'), message: this.get('chatMessage')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('chatMessage', '');
            });
        }
    }
    
});