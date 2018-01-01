import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    subject: '',
    message: '',
    ajax: service(),
    session: service(),
    flashMessages: service(),
    
    actions: {
        addPost() {
            let aj = this.get('ajax');
            aj.queryOne('addPost', { category_id: this.get('model.id'), 
               subject: this.get('subject'),
               message: this.get('message') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('Topic added!');
                this.transitionToRoute('forum.topic', 
                          this.get('model.id'), 
                          response.id);
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});