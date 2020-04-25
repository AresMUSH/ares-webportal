import $ from "jquery"
import Controller from '@ember/controller';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localTime } from 'ares-webportal/helpers/local-time';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import SceneUpdate from 'ares-webportal/mixins/scene-update';

export default Controller.extend(AuthenticatedController, SceneUpdate, {
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),
    favicon: service(),
  
    // Scenes
    currentScene: null,
  
    // Chat
    selectedChannel: null,
    newConversation: false,
    newConversationList: null,
    showAddChannel: null,
    
    // Both
    scrollPaused: false,

    init: function() {
      this._super(...arguments);
      this.set('newConversationList', []);
    },
  
    anyNewActivity: computed('model.scenes.@each.is_unread', function() {
      return this.get('model.scenes').any(s => s.is_unread );
    }),
  
    onSceneActivity: function(type, msg, timestamp ) {
      let splitMsg = msg.split('|');
      let sceneId = splitMsg[0];
      let char = splitMsg[1];
      let notify = true;
      let currentUsername = this.get('currentUser.name');
      
        // For poses we can just add it to the display.  Other events require a reload.
        if (sceneId === this.get('currentScene.id')) {
          let scene = this.currentScene;
          
          notify = this.updateSceneData(scene, msg, timestamp);

          if (currentUsername != char) {
            scene.set('is_unread', false);
          }
          else {
            notify = false;
          }
          
          if (notify) {
            this.gameSocket.notify(`New activity from ${char} in scene ${sceneId}.`);
            this.scrollWindow();
          }          
        }
        else {
            this.get('model.scenes').forEach(s => {
                if (s.id === sceneId) {
                  notify = this.updateSceneData(s, msg, timestamp);
                  if (currentUsername != char) {
                    s.set('is_unread', true);
                    this.gameSocket.notify(`New activity from ${char} in one of your other scenes (${sceneId}).`);
                  }
                }
            });            
        }
        this.markSceneRead(sceneId);
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
            this.scrollWindow();
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

    resetOnExit: function() {
        this.set('scrollPaused', false);
        this.set('selectedChannel', null);
        this.set('chatMessage', '');
        this.set('scrollPaused', false);
        this.set('newConversation', false);
        this.set('reportReason', '');
        this.set('showReport', false);
        this.set('newConversationList', []);
        this.set('selectedReportMessage', null);
    },
    
    setupCallback: function() {
        let self = this;
        this.gameSocket.setupCallback('new_scene_activity', function(type, msg, timestamp) {
            self.onSceneActivity(type, msg, timestamp) } );
        this.gameSocket.setupCallback('new_chat', function(type, msg, timestamp) {
            self.onChatMessage(type, msg, timestamp) } );
        this.gameSocket.setupCallback('new_page', function(type, msg, timestamp) {
            self.onChatMessage(type, msg, timestamp) } );
    },
    
    scrollWindow: function() {
      // Unless scrolling paused or edit active.
      let poseEditActive =  this.currentScene && this.get('currentScene.poses').some(p => p.editActive);
      if (this.scrollPaused || poseEditActive) {
        return;
      }
      
      try {
        let chatWindow = $('#chat-window')[0];
        if (chatWindow) {
            $('#chat-window').stop().animate({
                scrollTop: chatWindow.scrollHeight
            }, 400);    
        }  
        
        let sceneWindow = $('#live-scene-log')[0];
        if (sceneWindow) {
          $('#live-scene-log').stop().animate({
              scrollTop: $('#live-scene-log')[0].scrollHeight
          }, 400);           
        }
      }
      catch(error) {
        // This happens sometimes when transitioning away from screen.
      }   
    },
    
    channelsByActivity: computed('model.chat.@each.last_activity', function() {
       return this.get('model.chat').sort(function(a,b){
        return new Date(b.last_activity) - new Date(a.last_activity);
       });
    }),
    
    anyNewActivity: computed('model.chat.@each.{is_unread,new_messages}', function() {
      return this.get('model.chat').any(c => c.is_unread || c.new_messages > 0);
    }),
    
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
    
    getChannel: function(channelKey) {
      return this.get('model.chat').find(c => c.key === channelKey);
    },
    
    markSceneRead: function(sceneId) {
     this.gameApi.requestOne('markSceneRead', { id: sceneId }, null);
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
            
      joinChannel: function(channelName) {
          let api = this.gameApi;
                    
          api.requestOne('joinChannel', { channel: channelName }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.send('refresh');
          });
      },
    
      
        refresh() {
            this.resetOnExit();
            this.send('reloadModel');
        },
        
        setScroll(option) {
          this.set('scrollPaused', !option);
          if (option) {
            this.scrollWindow();
          }
        },
        
        scrollDown() {
          this.scrollWindow();
        },
        
        switchScene(id) {
          this.get('model.scenes').forEach(s => {
              if (s.id === id) {
                  s.set('is_unread', false);
                  this.set('currentScene', s);
                  this.set('selectedChannel', null);
                  let self = this;
                  setTimeout(() => self.scrollWindow(), 150, self);
                  this.markSceneRead(id);
              }
          });   
        },
        
        changeChannel: function(channel) {
            this.set('selectedChannel', channel);
            this.set('currentScene', null);
            set(channel, 'new_messages', null);
            set(channel, 'is_unread', false);
            if (this.get('selectedChannel.is_page'))  {
              this.markPageThreadRead(channel.key);
            } 
            let self = this;
            setTimeout(() => self.scrollWindow(), 150, self);
            
        },
        
        conversationListChanged(newList) {
            this.set('newConversationList', newList);
        },
        
        
        startConversation: function() {
          let api = this.gameApi;
          let message = this.chatMessage;
          let names = (this.newConversationList || []).map(p => p.name);
          this.set(`chatMessage`, '');
          this.set('selectedChannel', null);
          this.set('newConversation', false);
          this.set('newConversationList', []);

          api.requestOne('sendPage', { names: names, message: message }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.send('refresh');
          });
        },

        pauseScroll() {
          this.set('scrollPaused', true);
        },
        
        unpauseScroll() {
          this.set('scrollPaused', false);
          this.scrollWindow();
        }
    }
});