import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  recaptchaResponse: '',
  turnstileResponse: '',
  session: service(),
  flashMessages: service(),
  gameApi: service(),
  router: service(),
  
  resetOnExit: function() {
    this.set('reCaptchaResponse', '');
    this.set('turnstileResponse', '');
  },
  
  @action
  setTurnstileReset(callback) {
    this.set('turnstileReset', callback);
  },
  
  @action
  setRecaptchaRef(element) {
    this.set('recaptchaControl', element);
  },
  
  
  @action
  recaptchaResolved(response) {
    this.set('recaptchaResponse', response);
  },
  
  @action
  tour() {
            
    this.gameApi.requestOne('tour', 
    { 
      recaptcha: this.recaptchaResponse,
      turnstile: this.turnstileResponse
    }, null)
    .then((response) => {    
      if (response.error) {   
        if (this.recaptchaControl) {
          this.set('recaptchaResponse', '');
          this.recaptchaControl.reset();  
        }
        if (this.turnstileReset) { 
          this.set('turnstileResponse', '');
          this.turnstileReset();
        }
             
        return;
      }                
      this.flashMessages.success(`Your character name is ${response['name']} and password ${response['password']}.`);
      
      this.session.authenticate('authenticator:ares', { name: response['name'], password: response['password'] })
      .then(() => {
                 
        this.router.transitionTo('play');
        
      });
      
    });
  }
});