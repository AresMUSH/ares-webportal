import Controller from '@ember/controller';
import EmberObject, { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localTime } from 'ares-webportal/helpers/local-time';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import SceneUpdate from 'ares-webportal/mixins/scene-update';
import { action } from '@ember/object';
import { pushObject, removeObject } from 'ares-webportal/helpers/object-ext';
import { scrollElementToBottom } from 'ares-webportal/helpers/scroll-element';

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
  showNewConversation: false,
  newConversationList: null,
  showAddChannel: false,
  showAllChannels: false,
  showAllPms: false,
  poseChar: null,
  newPage: null,
      
  // Both
  scrollPaused: false,
  
  init: function() {
    this._super(...arguments);
    this.set('newConversationList', []);
  },
  
  sortedChannels: computed('model.chat.channels.@each.title', function() {
    return this.get('model.chat.channels').filter(c => !c.is_page).sort((a, b) => a.title.localeCompare(b.title));
  }),

  sortedPageThreads: computed('model.chat.channels.@each.title', function() {
    return this.get('model.chat.channels').filter(c => c.is_page).sort((a, b) => a.title.localeCompare(b.title));
  }),
  
  emptyPrompt: computed('selectedChannel', 'currentScene', function() {
    return !this.selectedChannel && !this.currentScene;
  }),
    
  onSceneActivity: function(type, msg, timestamp ) {
    let splitMsg = msg.split('|');
    let sceneId = splitMsg[0];
    let char = splitMsg[1];
    let notify = true;
    let currentUsername = this.get('currentUser.name');
    let alts = this.model.app.alts ? this.model.app.alts.map(c => c.name) : [ currentUsername ];
      
    // For poses we can just add it to the display.  Other events require a reload.
    if (sceneId === this.get('currentScene.id')) {
      let scene = this.currentScene;
          
      notify = this.updateSceneData(scene, msg, timestamp);
          
      // -1 is not found
      if (alts.indexOf(char) < 0) {
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
                  
          // -1 is not found
          if (alts.indexOf(char) < 0) {
            s.set('is_unread', true);
            this.gameSocket.notify(`New activity from ${char} in one of your other scenes (${sceneId}).`);
          }
        }
      });            
    }
    this.markSceneRead(sceneId);
  },
    
  onChatMessage: function(type, msg, timestamp) {
    let msgData = JSON.parse(msg);
    let channelKey = msgData.key;
    let channelTitle = msgData.title;
    let newMessage = msgData.message;
    let author = msgData.author;
    let messageId = msgData.message_id;
    let localTimestamp = localTime(timestamp);
      
    let channel = this.getChannel(channelKey);
    if (!channel) {
      channel = this.addPageChannel(msgData);
    }
      
    if (!channel.messages.find(m => m.id === messageId)) {
      pushObject(channel.messages, 
         {message: newMessage, timestamp: localTimestamp, author: author, id: messageId},
           channel,
           'messages');
    }
    set(channel, 'last_activity', Date.now());
    if (!channel.is_hidden) {
      set(channel, 'is_recent', true);
    }
    if (channelKey === this.get('selectedChannel.key')) {
      this.scrollWindow();
      if (channel.is_page) {
        this.markPageThreadRead(channel.key);
        // No browser notifications for channels because it's too spammy.
        this.gameSocket.highlightFavicon();
      }
    }
    else {
      let messageCount = channel.new_messages || 0;
      set(channel, 'new_messages', messageCount + 1);

      if (channel.is_page) {
        this.gameSocket.notify(`New conversation activity in ${channelTitle}.`);
        // No browser notifications for channels because it's too spammy.
        this.gameSocket.highlightFavicon();
      }
    }
  },
    
  onJoinedScene: function(type, msg, timestamp ) {
    let sceneData = EmberObject.create(JSON.parse(msg));

    if (!this.get('model.scenes').find(s => s.id === sceneData.id)) {
      pushObject(this.model.scenes, sceneData, this.model, 'scenes');
    }
  },
    
  resetOnExit: function() {
    this.set('currentScene', null);
    this.set('selectedChannel', null);

    this.set('showNewConversation', false);
    this.set('newConversationList', false);
    this.set('showAddChannel', false);
    this.set('scrollPaused', false);
  },
    
  setup: function(model) {
    this.setupCallback();
    this.set('poseChar', model.chat.pose_chars[0]);
  },
    
  setupCallback: function() {
    let self = this;
    this.gameSocket.setupCallback('new_scene_activity', function(type, msg, timestamp) {
      self.onSceneActivity(type, msg, timestamp) 
    } );
    this.gameSocket.setupCallback('new_chat', function(type, msg, timestamp) {
      self.onChatMessage(type, msg, timestamp) 
    } );
    this.gameSocket.setupCallback('new_page', function(type, msg, timestamp) {
      self.onChatMessage(type, msg, timestamp) 
    } );
    this.gameSocket.setupCallback('joined_scene', function(type, msg, timestamp) {
      self.onJoinedScene(type, msg, timestamp) 
    } );
  },
    
  scrollWindow: function() {
    // Unless scrolling paused or edit active.
    let poseEditActive =  this.currentScene && this.get('currentScene.poses').some(p => p.editActive);
    if (this.scrollPaused || poseEditActive) {
      return;
    }
    
    scrollElementToBottom('chat-window');
    scrollElementToBottom('live-scene-log');
  },
    
  channelsByActivity: computed('model.chat.channels.@each.last_activity', function() {
    return this.get('model.chat.channels').sort(function(a,b){
      return new Date(b.last_activity) - new Date(a.last_activity);
    });
  }),
    
  anyNewActivity: computed('model.chat.channels.@each.{is_unread,new_messages}', 'model.scenes.@each.is_unread', function() {
    return this.get('model.chat.channels').some(c => c.is_unread || c.new_messages > 0) || this.get('model.scenes').some(s => s.is_unread );
  }),
        
    
  addPageChannel: function(data) {
    let channel = { title: data.title, 
      key: data.key, 
      enabled: true, 
      can_join: true, 
      can_talk: true,
      is_page: true, 
      muted: false,
      poseable_chars: data.poseable_chars,
      messages: [],
      who: []
    };
    pushObject(this.get('model.chat.channels'), channel, this.model.chat, 'channels');
    return channel;
  },
    
  getChannel: function(channelKey) {
    return this.get('model.chat.channels').find(c => c.key === channelKey);
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
    
  updateChannel: function(channel) {
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
    
  updateScene(scene) {
    scene.set('is_unread', false);
    this.set('currentScene', scene);
    this.set('selectedChannel', null);
    let self = this;
    setTimeout(() => self.scrollWindow(), 150, self);
    this.markSceneRead(scene.id);
  },
      
  @action   
  joinChannel(channelName) {
    let api = this.gameApi;
    this.set('showAddChannel', false);
                    
    api.requestOne('joinChannel', { channel: channelName, char: this.poseChar.name }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      let data = response.channel;
      let channel = this.getChannel(data.key);
      removeObject(this.get('model.chat.channels'), channel);
      pushObject(this.get('model.chat.channels'), data, this.model.chat, 'channels');
      this.updateChannel(data);
    });
  },
    
  @action
  refresh() {
    this.resetOnExit();
    this.send('reloadModel');
  },
        
  @action
  setScroll(option) {
    this.set('scrollPaused', !option);
    if (option) {
      this.scrollWindow();
    }
  },
        
  @action
  scrollDown() {
    this.scrollWindow();
  },
        
  @action
  switchScene(id) {
    let api = this.gameApi;
    var scene;
    this.get('model.scenes').forEach(s => {
      if (s.id === id) {
        scene = s;
      }
    });
          
    if (scene.lazy_loaded === true) {
      api.requestOne('liveScene', { id: scene.id }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        scene.set('poses', response.poses);
        scene.set('lazy_loaded', false);
        this.updateScene(scene);
      });
    } else {
      this.updateScene(scene);
    }
  },
        
  @action
  changeChannel(channel) {
    let api = this.gameApi;
          
    if (channel.lazy_loaded === true) {
      api.requestOne('loadChatMessages', { key: channel.key, is_page: channel.is_page }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        set(channel, 'messages', response.messages);
        set(channel, 'lazy_loaded', false);
        this.updateChannel(channel);
      });
    } else {
      this.updateChannel(channel);
    }
          
  },
        
  @action
  conversationListChanged(newList) {
    this.set('newConversationList', newList);
  },
        
  @action
  startConversation() {
    let api = this.gameApi;
    let message = this.newPage;
    let names = (this.newConversationList || []).map(p => p.name);
          
    if (names.length === 0) {
      this.flashMessages.danger("You haven't entered any recipients.");
      return;
    }
    if (!message || message.length === 0) {
      this.flashMessages.danger("You haven't entered anything.");
      return;
    }
    if (!this.poseChar) {
      this.flashMessages.danger("You hven't selected a charcter.");
    }
          
    this.set(`newPage`, '');
    this.set('selectedChannel', null);
    this.set('showNewConversation', false);
    this.set('newConversationList', []);

    api.requestOne('sendPage', { names: names, message: message, sender: this.poseChar.name }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      let channel = this.getChannel(response.thread.key);
      if (!channel) {
        channel = response.thread;
        pushObject(this.get('model.chat.channels'), channel, this.model.chat, 'channels');
      } 
      this.updateChannel(channel);
    });
  },

  @action
  pauseScroll() {
    this.set('scrollPaused', true);
  },
        
  @action
  unpauseScroll() {
    this.set('scrollPaused', false);
    this.scrollWindow();
  },
        
  @action
  poseCharChanged(char) {
    this.set('poseChar', char);
  },
  

  @action
  setShowNewConversation(value) {
    this.set('showNewConversation', value);
  },
  
  @action
  setShowAllPms(value) {
    this.set('showAllPms', value);
  },
  
  @action
  setShowAddChannel(value) {
    this.set('showAddChannel', value);
  },
  
  @action
  setShowAllChannels(value) {
    this.set('showAllChannels', value);
  },
});