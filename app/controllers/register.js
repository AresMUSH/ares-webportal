import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    name: '',
    password: '',
    confirmPassword: '',
    reCaptchaResponse: '',
    session: service(),
    flashMessages: service(),
    gameApi: service(),
    
    actions: {
        recaptchaResolved(reCaptchaResponse) {
            this.set('reCaptchaResponse', reCaptchaResponse);
            
        },
        register() {
            
           this.get('gameApi').requestOne('register', 
               { name: this.get('name'), password: this.get('password'), confirm_password: this.get('confirmPassword'), recaptcha: this.get('reCaptchaResponse')}, null)
            .then((response) => {            
                if (response.error) {
                    this.get('recaptchaControl').resetReCaptcha();
                    return;
                }                
                this.get('flashMessages').success("Your character has been created.  Please log in.");
                this.transitionToRoute('login');
            });
        }
    }
});