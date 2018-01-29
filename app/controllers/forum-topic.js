import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    reply: '',
    ajax: service(),
    session: service(),
    flashMessages: service(),
    
    resetOnExit: function() {
        this.set('reply', '');
    },
    
    actions: {
        addReply() {
            let aj = this.get('ajax');
            aj.requestOne('forumReply', { topic_id: this.get('model.id'), 
               reply: this.get('reply')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('reply', '');
                this.send('reloadModel');
              this.get('flashMessages').success('Reply added!');
            });
        }
    }
});