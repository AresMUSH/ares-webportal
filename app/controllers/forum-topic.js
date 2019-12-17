import { set } from '@ember/object';
import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    reply: '',
    gameApi: service(),
    session: service(),
    gameSocket: service(),
    flashMessages: service(),
    confirmDeleteTopic: null,
    confirmDeleteReply: null,
    
    resetOnExit: function() {
        this.set('reply', '');
        this.set('confirmDeleteReply', null);
        this.set('confirmDeleteTopic', null);
    },
    
    onForumActivity: function(type, msg, timestamp ) {
     let data = JSON.parse(msg);
     if (data.post != this.get('model.id')) {
       return;
     }
     let currentUserId = this.get('currentUser.id');
     
     if (data.type == 'forum_reply') {
       this.get('model.replies').pushObject( {
         author: data.author,
         date: timestamp,
         id: data.reply,
         message: data.message,
         raw_message: data.raw_message,
         can_edit: currentUserId == data.author.id
       });
     }
     else if (data.type == 'forum_edited') {
       this.set('model.message', data.message);
       this.set('model.raw_message', data.raw_message);
       this.set('model.can_edit', currentUserId == data.author.id);
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
            self.onForumActivity(type, msg, timestamp) } );
    },
    
    actions: {
        addReply() {
            let api = this.gameApi;
            api.requestOne('forumReply', { topic_id: this.get('model.id'), 
               reply: this.reply}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('reply', '');
              this.flashMessages.success('Reply added!');
            });
        },
        
        nextUnread: function() {
            let api = this.gameApi;
            api.requestOne('forumUnread')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                
                if (response.post_id) {
                    this.transitionToRoute('forum-topic', response.category_id, response.post_id);
                }
                else {
                    this.flashMessages.warning('No more unread messages.');                    
                }
            });
        },
        editReply: function(reply) {
          let api = this.gameApi;
          api.requestOne('forumEditReply', { reply_id: reply.id, 
             message: reply.raw_message }, null)
          .then( (response) => {
              if (response.error) {
                this.flashMessages.error(response.error);
                return;
              }
              set(reply, 'editActive', false);
             this.flashMessages.success('Reply edited!');
          });
        },
        
        editPost: function() {
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
        
        deleteReply: function(reply) {
          let api = this.gameApi;
          this.get('model.replies').removeObject(reply);
          this.set('confirmDeleteReply', null);
          api.requestOne('forumDeleteReply', { reply_id: reply.id })
          .then( (response) => {
              if (response.error) {
                return;
              }
            this.flashMessages.success('Reply deleted!');
          });
        },
        deleteTopic: function() {
          let api = this.gameApi;
          this.set('confirmDeleteTopic', null);
          api.requestOne('forumDeleteTopic', { topic_id: this.get('model.id') })
          .then( (response) => {
              if (response.error) {
                return;
              }
            this.transitionToRoute('forum-category', this.get('model.category.id'));
            this.flashMessages.success('Post deleted!');
          });
        }
    }
});