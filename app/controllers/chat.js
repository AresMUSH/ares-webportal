import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    notifications: service(),
    ajax: service(),
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
        this.get('notifications').changeFavicon(true);                    
        
        let self = this;
        
        $(window).focus(function(){
            self.get('notifications').changeFavicon(false);                    
        });
        
        if (channelKey === this.get('selectedChannel').toLowerCase()) {
            this.scrollChatWindow();
        }
        else {
            let messageCount = this.get(`model.channels.${channelKey}.new_messages`) || 0;
            this.set(`model.channels.${channelKey}.new_messages`, messageCount + 1);
        }
        this.get('notifications').notify('New chat activity!');
    },
    
    scrollChatWindow: function() {
        $('#chat-window').stop().animate({
            scrollTop: $('#chat-window')[0].scrollHeight
        }, 800);    
    },
    
    setupCallback: function() {
        let self = this;
        this.get('notifications').set('chatCallback', function(channel) {
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
            let aj = this.get('ajax');
            aj.requestOne('chatTalk', { channel: this.get('selectedChannel'), message: this.get('chatMessage')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('chatMessage', '');
            });
        }
    }
    
});