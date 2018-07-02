import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    
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
                this.transitionToRoute('location', this.get('model.id'));
                this.get('flashMessages').success('Area updated!');
            });
        }
    }
});