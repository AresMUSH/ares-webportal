import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    confirmDelete: false,
    
    actions: {

        delete() {
            let api = this.gameApi;
            this.set('confirmDelete', false);
            api.requestOne('deleteLocation', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.router.transitionTo('locations');
                this.flashMessages.success('Location deleted!');
            });
        }
        
    }
});