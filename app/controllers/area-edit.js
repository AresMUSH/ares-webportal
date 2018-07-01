import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    confirmDelete: false,
    
    actions: {

        edit: function() {
            let api = this.get('gameApi');
            api.requestOne('editArea', { id: this.get('model.id'),
               name: this.get('model.name'), 
               description: this.get('model.description') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('locations');
                this.get('flashMessages').success('Area updated!');
            });
        },
        
        
        delete() {
            let api = this.get('gameApi');
            this.set('confirmDelete', false);
            api.requestOne('deleteArea', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('locations');
                this.get('flashMessages').success('Area deleted!');
            });
        }
    }
});