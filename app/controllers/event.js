import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    confirmDelete: false,
    
    actions: {
        delete: function() {
            let api = this.get('gameApi');
            this.set('confirmDelete', false);
            api.requestOne('deleteEvent', { event_id: this.get('model.id') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('events');
                this.get('flashMessages').success('Event deleted!');
            });
        }
    }
});