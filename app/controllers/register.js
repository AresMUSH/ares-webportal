import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  name: '',
  password: '',
  confirmPassword: '',
  recaptchaResponse: '',
  turnstileResponse: '',
  session: service(),
  flashMessages: service(),
  gameApi: service(),
  router: service(),
  
  resetOnExit: function() {
    this.set('name', '');
    this.set('password', '');
    this.set('confirmPassword', '');
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
  register() {
            
    this.gameApi.requestOne('register', 
    { 
      name: this.name, 
      password: this.password, 
      confirm_password: this.confirmPassword, 
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
      this.flashMessages.success("Your character has been created.  Please log in.");
      this.router.transitionTo('login');
    });
  }
});