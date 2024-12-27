import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, ConfirmAction, {
  gameApi: service(),
  flashMessages: service(),
  router: service(),
  signupAs: null,
  
  resetOnExit: function() {
    this.hideActionConfirmation();
    this.set('signupAs', null);
  },
    
  @action
  delete() {
    let api = this.gameApi;
    this.hideActionConfirmation();
    api.requestOne('deleteEvent', { event_id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('events');
      this.flashMessages.success('Event deleted!');
    });
  },
        
  @action
  createScene() {
    let api = this.gameApi;
    api.requestOne('createEventScene', { event_id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('play');
      this.flashMessages.success('Event scene created!');
    });
  },
        
  @action
  signup() {
    let api = this.gameApi;
    api.requestOne('eventSignup', { event_id: this.get('model.id'), 
    comment: this.get('model.signup_comment'), 
    signup_as: this.get('signupAs.name') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('events');
      this.flashMessages.success('Signed up!');
    });
  },
        
  @action
  cancelSignup(name) {
    let api = this.gameApi;
    api.requestOne('eventCancelSignup', { event_id: this.get('model.id'), name: name }, 'events')
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('events');
      this.flashMessages.success('Signup canceled.');
    });
  },
        
  @action
  signupAsChanged(alt) {
    this.set('signupAs', alt);
  },
});