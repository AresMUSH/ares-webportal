import { set } from '@ember/object';
import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  gameSocket: service(),
  session: service(),
  flashMessages: service(),
  router: service(),
    
  onForumActivity: function(type, msg, timestamp ) {
    let data = JSON.parse(msg);
    if (data.category != this.get('model.id')) {
      return;
    }
     
    if (data.type == 'new_forum_post') {
      this.get('model.posts').push( {
        author: data.author.name,
        category_id: data.category,
        date: timestamp,
        id: data.post,
        last_activity: timestamp,
        title: data.subject,
        unread: true
      });
      notifyPropertyChange(this, 'model');
    }
    else if (data.type == 'forum_reply') {
      let post = this.get('model.posts').find( p => p.id == data.post );
      if (post) {
        set(post, 'last_activity', timestamp);
        set(post, 'unread', true);
      }
    }
  },
      
  setupCallback: function() {
    let self = this;
    this.gameSocket.setupCallback('new_forum_activity', function(type, msg, timestamp) {
      self.onForumActivity(type, msg, timestamp) 
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
  catchup() {
    let api = this.gameApi;
    api.requestOne('forumCatchup', { category_id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('All topics marked as read!');
    });
  }
});