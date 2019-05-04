import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameSocket: service(),
    favicon: service(),
    gameApi: service(),
    selectedChannel: '',
    chatMessage: '',
    scrollPaused: false,
    
    onChatMessage: function(msg, timestamp) {
        let splitMsg = msg.split('|');
        let channelKey = splitMsg[0];
        let newMessage = splitMsg[1];

        let messages = this.get(`model.chat.channels.${channelKey}.messages`);
        messages.pushObject({message: newMessage, timestamp: timestamp });
        if (channelKey === this.get('selectedChannel').toLowerCase()) {
            this.scrollChatWindow();
        }
        else {
            let messageCount = this.get(`model.chat.channels.${channelKey}.new_messages`) || 0;
            this.set(`model.chat.channels.${channelKey}.new_messages`, messageCount + 1);
        }
        // No browser notifications because it's too spammy.
        this.get('gameSocket').highlightFavicon();
    },
    
    scrollChatWindow: function() {
      // Unless scrolling paused 
      if (this.get('scrollPaused')) {
        return;
      }
      
      try {
        let chatWindow = $('#chat-window')[0];
        if (chatWindow) {
            $('#chat-window').stop().animate({
                scrollTop: chatWindow.scrollHeight
            }, 400);    
        }  
      }
      catch(error) {
        // This happens sometimes when transitioning away from screen.
      }   
    },
    
    scrollPageWindow: function() {      
      try {
        let pageWindow = $('#page-window')[0];
        if (pageWindow) {
            $('#page-window').stop().animate({
                scrollTop: pageWindow.scrollHeight
            }, 400);    
        }  
      }
      catch(error) {
        // This happens sometimes when transitioning away from screen.
      }   
    },
    
    setupCallback: function() {
        let self = this;
        this.get('gameSocket').set('chatCallback', function(msg, timestamp) {
            self.onChatMessage(msg, timestamp) } );
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
        
        scrollDownPages: function() {
            this.scrollPageWindow();
        },
        
        changeChannel: function(channel) {
            this.set('selectedChannel', channel);
            let channelKey = channel.toLowerCase();
            this.set(`model.chat.channels.${channelKey}.new_messages`, null);
            let self = this;
            setTimeout(() => self.scrollChatWindow(), 150, self);
        },
        
        joinChannel: function(channelName) {
            let api = this.get('gameApi');
                        
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
        },
        
        selectPageGroup: function(group) {
          this.set('selectedPageGroup', group);
          this.scrollPageWindow();
        },

        pauseScroll() {
          this.set('scrollPaused', true);
        },
        unpauseScroll() {
          this.set('scrollPaused', false);
          this.scrollChatWindow();
        }
    }
    
});