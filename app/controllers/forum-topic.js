import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    reply: '',
    gameApi: service(),
    session: service(),
    flashMessages: service(),
    confirmDeleteTopic: null,
    confirmDeleteReply: null,
    
    resetOnExit: function() {
        this.set('reply', '');
        this.set('confirmDeleteReply', null);
        this.set('confirmDeleteTopic', null);
    },
    
    actions: {
        addReply() {
            let api = this.get('gameApi');
            api.requestOne('forumReply', { topic_id: this.get('model.id'), 
               reply: this.get('reply')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('reply', '');
                this.send('reloadModel');
              this.get('flashMessages').success('Reply added!');
            });
        },
        
        nextUnread: function() {
            let api = this.get('gameApi');
            api.requestOne('forumUnread')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                
                if (response.post_id) {
                    this.transitionToRoute('forum-topic', response.category_id, response.post_id);
                }
                else {
                    this.get('flashMessages').warning('No more unread messages.');                    
                }
            });
        },
        editReply: function(reply) {
          let api = this.get('gameApi');
          api.requestOne('forumEditReply', { reply_id: reply.id, 
             message: reply.raw_message }, null)
          .then( (response) => {
              if (response.error) {
                this.get('flashMessages').error(response.error);
                return;
              }
              Ember.set(reply, 'editActive', false);
             this.get('flashMessages').success('Reply edited!');
             this.send('reloadModel');
          });
        },
        
        editPost: function() {
          let api = this.get('gameApi');
          api.requestOne('forumEditTopic', { topic_id: this.get('model.id'), 
             subject: this.get('model.title'),
             message: this.get('model.raw_message') }, null)
          .then( (response) => {
              if (response.error) {
                this.get('flashMessages').error(response.error);
                return;
              }
              this.set('model.editActive', false);
              this.get('flashMessages').success('Post edited!');
              this.send('reloadModel');
          });
        },
        
        deleteReply: function(reply) {
          let api = this.get('gameApi');
          this.get('model.replies').removeObject(reply);
          this.set('confirmDeleteReply', null);
          api.requestOne('forumDeleteReply', { reply_id: reply.id })
          .then( (response) => {
              if (response.error) {
                return;
              }
            this.get('flashMessages').success('Reply deleted!');
          });
        },
        deleteTopic: function() {
          let api = this.get('gameApi');
          this.set('confirmDeleteTopic', null);
          api.requestOne('forumDeleteTopic', { topic_id: this.get('model.id') })
          .then( (response) => {
              if (response.error) {
                return;
              }
            this.transitionToRoute('forum-category', this.get('model.category.id'));
            this.get('flashMessages').success('Post deleted!');
          });
        }
    }
});