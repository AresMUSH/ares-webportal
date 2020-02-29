import $ from "jquery"
import { set, computed } from '@ember/object';
import Controller from '@ember/controller';
import { localTime } from 'ares-webportal/helpers/local-time';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameSocket: service(),
    favicon: service(),
    gameApi: service(),
    flashMessages: service(),
    selectedChannel: null,
    chatMessage: '',
    scrollPaused: false,
    newConversation: false,
    showReport: false,
    selectedReportMessage: null,
    reportReason: '',
    newConversationList: null,

    init: function() {
      this._super(...arguments);
      this.set('newConversationList', []);
    },
      
    channelsByActivity: computed('model.chat.@each.last_activity', function() {
       return this.get('model.chat').sort(function(a,b){
        return new Date(b.last_activity) - new Date(a.last_activity);
       });
    }),
    
    anyNewActivity: computed('model.chat.@each.{is_unread,new_messages}', function() {
      return this.get('model.chat').any(c => c.is_unread || c.new_messages > 0);
    }),
    
    resetOnExit: function() {
        this.set('selectedChannel', null);
        this.set('chatMessage', '');
        this.set('scrollPaused', false);
        this.set('newConversation', false);
        this.set('reportReason', '');
        this.set('showReport', false);
        this.set('newConversationList', []);
        this.set('selectedReportMessage', null);
    },
    
    onChatMessage: function(type, msg, timestamp) {
        let splitMsg = msg.split('|');
        let channelKey = splitMsg[0];
        let channelTitle = splitMsg[1];
        let newMessage = splitMsg[2];
        let channel = this.getChannel(channelKey);
        let localTimestamp = localTime(timestamp); 

        if (!channel) {
          channel = this.addPageChannel(channelKey, channelTitle);
        }
        channel.messages.pushObject({message: newMessage, timestamp: localTimestamp});
        set(channel, 'last_activity', Date.now());
        if (channelKey === this.get('selectedChannel.key')) {
            this.scrollChatWindow();
            if (channel.is_page) {
              this.markPageThreadRead(channel.key);
            }
        }
        else {
            let messageCount = channel.new_messages || 0;
            set(channel, 'new_messages', messageCount + 1);

            if (channel.is_page) {
              this.gameSocket.notify(`New conversation activity in ${channelTitle}.`);
            }

        }
        // No browser notifications for channels because it's too spammy.
        this.gameSocket.highlightFavicon();
    },
    
    addPageChannel: function(key, title) {
      let channel = { title: title, 
        key: key, 
        enabled: true, 
        can_join: true, 
        can_talk: true,
        is_page: true, 
        muted: false,
        messages: [],
        who: []
      };
      this.get('model.chat').pushObject(channel);
      return channel;
    },
    
    scrollChatWindow: function() {
      // Unless scrolling paused 
      if (this.scrollPaused) {
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
    
    setupCallback: function() {
        let self = this;
        this.gameSocket.setupCallback('new_chat', function(type, msg, timestamp) {
            self.onChatMessage(type, msg, timestamp) } );
        this.gameSocket.setupCallback('new_page', function(type, msg, timestamp) {
            self.onChatMessage(type, msg, timestamp) } );
    },
    
    getChannel: function(channelKey) {
      return this.get('model.chat').find(c => c.key === channelKey);
    },
    
    markPageThreadRead: function(threadId) {
      let api = this.gameApi;
      api.requestOne('markPageThreadRead', { thread_id: threadId }, null)
      .then( (response) => {
          if (response.error) {
              return;
          }
      }); 
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
            set(channel, 'new_messages', null);
            set(channel, 'is_unread', false);
            if (this.get('selectedChannel.is_page'))  {
              this.markPageThreadRead(channel.key);
            } 
            let self = this;
            setTimeout(() => self.scrollChatWindow(), 150, self);
            
        },
        
        conversationListChanged(newList) {
            this.set('newConversationList', newList);
        },
        
        joinChannel: function(channelName) {
            let api = this.gameApi;
                        
            api.requestOne('joinChannel', { channel: channelName }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        leaveChannel: function() {
            let api = this.gameApi;
            let channelKey = this.get('selectedChannel.key');
                        
            api.requestOne('leaveChannel', { channel: channelKey }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        muteChannel: function(mute) {
            let api = this.gameApi;
            let channelKey = this.get('selectedChannel.key');
                        
            api.requestOne('muteChannel', { channel: channelKey, mute: mute }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        newConversation: function() {
          this.set('selectedChannel', null);
          this.set('newConversation', true);
        },
        
        reportChat: function() {
          let api = this.gameApi;
          let channelKey = this.get('selectedChannel.key');
          let reason = this.reportReason;
          let message = this.selectedReportMessage;
          this.set('reportReason', '');
          this.set('showReport', false);
          this.set('selectedReportMessage', null);
          
          
          if (reason.length == 0) {
            this.flashMessages.danger('You must enter a reason for the report.');
            return;
          }
          
          let command = this.get('selectedChannel.is_page') ? 'reportPage' : 'reportChat';
          
          api.requestOne(command, { key: channelKey, start_message: message, reason: reason }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.flashMessages.success('The messages have been reported to the game admin.');
          });
          
        },
        
        send: function() {
            let api = this.gameApi;
            let channelKey = this.get('selectedChannel.key');
            let message = this.chatMessage;
            this.set(`chatMessage`, '');
                      
            if (this.get('selectedChannel.is_page'))  {
              api.requestOne('sendPage', { thread_id: channelKey, message: message }, null)
              .then( (response) => {
                  if (response.error) {
                      return;
                  }
              }); 
            } else {
              api.requestOne('chatTalk', { channel: channelKey, message: message }, null)
              .then( (response) => {
                  if (response.error) {
                      return;
                  }
              });
            }
        },
        
        selectPageGroup: function(group) {
          this.set('selectedPageGroup', group);
          this.scrollPageWindow();
        },
        
        startConversation: function() {
          let api = this.gameApi;
          let message = this.chatMessage;
          let names = (this.newConversationList || []).map(p => p.name);
          this.set(`chatMessage`, '');
          this.set('newConversation', false);
          this.set('newConversationList', []);

          api.requestOne('sendPage', { names: names, message: message }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              let channel = this.getChannel(response.thread);              
              this.send('changeChannel', channel);
          });
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