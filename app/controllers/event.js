import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    flashMessages: service(),
    confirmDelete: false,
    
    actions: {
        delete: function() {
            let aj = this.get('ajax');
            this.set('confirmDelete', false);
            aj.requestOne('deleteEvent', { event_id: this.get('model.id') })
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