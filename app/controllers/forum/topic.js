import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    reply: '',
    ajax: service(),
    session: service(),
    flashMessages: service(),
    
    resetForm: function() {
        this.set('reply', '');
    },
    
    actions: {
        addReply() {
            let aj = this.get('ajax');
            aj.queryOne('addReply', { topic_id: this.get('model.id'), 
               reply: this.get('reply')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('reply', '');
                this.send('reloadModel', 
                    this.transitionToRoute('forum.topic', 
                              this.get('model.category.id'), 
                              this.get('model.id')));
              this.get('flashMessages').success('Reply added!');
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});