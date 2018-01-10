import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    name: '',
    password: '',
    confirm_password: '',
    reCaptchaResponse: '',
    session: service(),
    flashMessages: service(),
    ajax: service(),
    
    actions: {
        recaptchaResolved(reCaptchaResponse) {
            this.set('reCaptchaResponse', reCaptchaResponse);
            
        },
        register() {
            
           this.get('ajax').queryOne('register', 
               { name: this.get('name'), password: this.get('password'), confirm_password: this.get('confirm_password'), recaptcha: this.get('reCaptchaResponse')})
            .then((response) => {            
                if (response.error) {
                    this.get('recaptchaControl').resetReCaptcha();
                    return;
                }                
                this.transitionToRoute('login');
                this.get('flashMessages').success("Your character has been created.  Please log in.");
            })
            .catch((response) => {
                this.get('recaptchaControl').resetReCaptcha();
                this.get('flashMessages').danger(response);
            });
        }
    }
});