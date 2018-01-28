import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    subject: '',
    message: '',
    ajax: service(),
    session: service(),
    flashMessages: service(),
    
    resetOnExit: function() {
        this.set('subject', '');
        this.set('message', '');
    },
    
    actions: {
        addPost() {
            let aj = this.get('ajax');
            aj.requestOne('forumPost', { category_id: this.get('model.id'), 
               subject: this.get('subject'),
               message: this.get('message') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('forum-topic', 
                          this.get('model.id'), 
                          response.id);
                this.get('flashMessages').success('Topic added!');
            });
        }
    }
});