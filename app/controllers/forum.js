import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    gameSocket: service(),
    flashMessages: service(),
    
    anyHidden: computed('model.hidden', function() {
      return this.get('model.hidden').length > 0;
    }),

    onForumActivity: function(type, msg, timestamp ) {
     let data = JSON.parse(msg);
     if (data.type == 'new_forum_post' || data.type == 'forum_reply') {
       let category = this.get('model.categories').find(c => c.id == data.category);
       if (category) {
         set(category, 'last_activity', {
           author: data.author.name,
           date: timestamp,
           id: data.post,
           subject: data.subject,
           type: data.type == 'new_forum_post' ? 'post' : 'reply'
         });
         set(category, 'unread', true);
       }
     }
    },
        
    setupCallback: function() {
        let self = this;
        this.gameSocket.setupCallback('new_forum_activity', function(type, msg, timestamp) {
            self.onForumActivity(type, msg, timestamp) } );
    },
    
    actions: {
      catchup: function() {
        let api = this.gameApi;
        api.requestOne('forumCatchup')
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.send('reloadModel');
            this.flashMessages.success('All topics marked as read!');
        });
      },
      hideCategory: function(category, option) { 
        let api = this.gameApi;
        api.requestOne('forumHide', { hide: option, category_id: category.id })
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.send('reloadModel');
        });
      },
      muteForum: function(option) { 
        let api = this.gameApi;
        api.requestOne('forumMute', { muted: option })
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.set('model.is_muted', option);
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
      }
    }
});