import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    reply: '',
    ajax: service(),
    session: service(),
    flashMessages: service(),
    
    actions: {
        addReply() {
            let aj = this.get('ajax');
            aj.queryOne('addReply', { topic_id: this.get('model.id'), 
               reply: this.get('reply'),
               char_id: this.get('session.data.authenticated.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('Reply added!');
                this.send('reloadModel', 
                    this.transitionToRoute('forum.topic', 
                              this.get('model.category.id'), 
                              this.get('model.id')));
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});