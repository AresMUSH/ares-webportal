import { set } from '@ember/object';
import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { pushObject, removeObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend(AuthenticatedController, {
  reply: '',
  gameApi: service(),
  session: service(),
  gameSocket: service(),
  flashMessages: service(),
  router: service(),
  confirmDeleteTopic: false,
  confirmDeleteReply: false,
  chooseNewCategory: false,
  newCategory: null,
  author: null,
    
  resetOnExit: function() {
    this.set('reply', '');
    this.set('confirmDeleteReply', false);
    this.set('confirmDeleteTopic', false);
    this.set('author', null);
    this.set('chooseNewCategory', false);
    this.set('newCategory', null);
  },
    
  setup: function() {
    this.set('author', this.get('model.authors')[0]);
  },
    
  onForumActivity: function(type, msg, timestamp ) {
    let data = JSON.parse(msg);
    if (data.post != this.get('model.id')) {
      return;
    }
    let currentUserId = this.get('currentUser.id');
     
    if (data.type == 'forum_reply') {
      pushObject(this.get('model.replies'), {
        author: data.author,
        date: timestamp,
        id: data.reply,
        message: data.message,
        raw_message: data.raw_message,
        can_edit: currentUserId == data.author.id
      }, this.model, 'replies');
    }
    else if (data.type == 'forum_edited') {
      this.set('model.message', data.message);
      this.set('model.raw_message', data.raw_message);
      this.set('model.can_edit', currentUserId == data.author.id);
      this.set('model.tags', data.tags);
    }
    else if (data.type == 'reply_edited') {
      let reply = this.get('model.replies').find(r => r.id == data.reply);
      if (reply) {
        set(reply, 'can_edit', currentUserId == data.author.id);
        set(reply, 'message', data.message);  
        set(reply, 'raw_message', data.raw_message);       
      }
    }
  },
        
  setupCallback: function() {
    let self = this;
    this.gameSocket.setupCallback('new_forum_activity', function(type, msg, timestamp) {
      self.onForumActivity(type, msg, timestamp) 
    } );
  },
    
  @action
  addReply() {
    let api = this.gameApi;
    api.requestOne('forumReply', 
    {
      topic_id: this.get('model.id'), 
      reply: this.reply,
      author_id: this.get('author.id') 
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('reply', '');
      this.flashMessages.success('Reply added!');
    });
  },
        
  @action
  pinPost(pinned) {
    let api = this.gameApi;
    api.requestOne('forumPin', { topic_id: this.get('model.id'), pinned: pinned })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('model.is_pinned', pinned);
      if (pinned) {
        this.flashMessages.success('Topic pinned!');
      } else {
        this.flashMessages.success('Topic unpinned!');
      }
              
    });
  },
        
  @action
  nextUnread() {
    let api = this.gameApi;
    api.requestOne('forumUnread')
    .then( (response) => {
      if (response.error) {
        return;
      }
                
      if (response.post_id) {
        this.router.transitionTo('forum-topic', response.category_id, response.post_id);
      }
      else {
        this.flashMessages.warning('No more unread messages.');                    
      }
    });
  },
        
  @action
  editReply(reply) {
    let api = this.gameApi;
    api.requestOne('forumEditReply', 
    {
      reply_id: reply.id, 
      message: reply.raw_message 
    }, null)
    .then( (response) => {
      if (response.error) {
        this.flashMessages.error(response.error);
        return;
      }
      set(reply, 'editActive', false);
      this.flashMessages.success('Reply edited!');
    });
  },
        
  @action
  editPost() {
    let api = this.gameApi;
    api.requestOne('forumEditTopic', { topic_id: this.get('model.id'), 
    subject: this.get('model.title'),
    message: this.get('model.raw_message') }, null)
    .then( (response) => {
      if (response.error) {
        this.flashMessages.error(response.error);
        return;
      }
      this.set('model.editActive', false);
      this.flashMessages.success('Post edited!');
    });
  },
        
  @action
  deleteReply(reply) {
    let api = this.gameApi;
    removeObject(this.get('model.replies'), reply, this.model, 'replies');
    this.set('confirmDeleteReply', false);
    api.requestOne('forumDeleteReply', { reply_id: reply.id })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('Reply deleted!');
    });
  },
        
  @action
  deleteTopic() {
    let api = this.gameApi;
    this.set('confirmDeleteTopic', null);
    api.requestOne('forumDeleteTopic', { topic_id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('forum-category', this.get('model.category.id'));
      this.flashMessages.success('Post deleted!');
    });
  },
        
  @action
  authorChanged(author) {
    this.set('author', author);
  },

  @action
  moveTopic() {
    let api = this.gameApi;
    let categoryId = this.get('newCategory.id');
    this.set('chooseNewCategory', null);
    if (!categoryId) {
      this.flashMessages.danger('You must select a category.');
      return;
    }
    api.requestOne('forumMove', { topic_id: this.get('model.id'), category_id: categoryId })
    .then( (response) => {
      if (response.error) {
        return;
      }
                
      this.flashMessages.success('Topic moved!');
      this.router.transitionTo('forum-topic', response.category_id, response.post_id);
              
    });
  },
        
  @action
  newCategorySelected(category) {
    this.set('newCategory', category);
  },
  
  @action
  setEditActive(value) {
    this.model.set('editActive', value);
  },
  
  @action
  setReplyEditActive(reply, value) {
    set(reply, 'editActive', value);
  },
  
  @action
  setConfirmDeleteReply(value) {
    this.set('confirmDeleteReply', value);
  },
  
  @action
  setConfirmDeleteTopic(value) {
    this.set('confirmDeleteTopic', value);
  },
  
  @action
  setChooseNewCategory(value) {
    this.set('chooseNewCategory', value);
  }
});