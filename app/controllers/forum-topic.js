import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    reply: '',
    gameApi: service(),
    session: service(),
    flashMessages: service(),
    
    resetOnExit: function() {
        this.set('reply', '');
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
        }
    }
});