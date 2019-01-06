import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    confirmDelete: false,
  
    resetOnExit: function() {
      this.set('confirmDelete', false);
    },
    
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
        },
        signup: function() {
            let api = this.get('gameApi');
            api.requestOne('eventSignup', { event_id: this.get('model.id'), comment: this.get('model.signup_comment') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('events');
                this.get('flashMessages').success('Signed up!');
            });
        },
        cancelSignup: function() {
            let api = this.get('gameApi');
            api.requestOne('eventCancelSignup', { event_id: this.get('model.id') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('events');
                this.get('flashMessages').success('Signup canceled.');
            });
        }
    }
});