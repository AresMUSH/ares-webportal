import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webclient/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    confirmDelete: false,
    
    actions: {
        like(like) {
            let aj = this.get('ajax');
            aj.queryOne('likeScene', { id: this.get('model.id'), like: like})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel', {});
            });
        },
        
        delete() {
            let aj = this.get('ajax');
            this.set('confirmDelete', false);
            aj.queryOne('deleteScene', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('scenes');
                this.get('flashMessages').success('Scene deleted!');
            });
        }
    }
});