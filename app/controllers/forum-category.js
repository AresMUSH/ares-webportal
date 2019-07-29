import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    session: service(),
    flashMessages: service(),
    
    actions: {
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

        catchup: function() {
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
    }
});