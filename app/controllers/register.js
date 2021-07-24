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
    router: service(),
    
    actions: {
        recaptchaResolved(reCaptchaResponse) {
            this.set('reCaptchaResponse', reCaptchaResponse);
            
        },
        register() {
            
           this.gameApi.requestOne('register', 
               { name: this.name, password: this.password, confirm_password: this.confirmPassword, recaptcha: this.reCaptchaResponse}, null)
            .then((response) => {            
                if (response.error) {
                    this.recaptchaControl.resetReCaptcha();
                    return;
                }                
                this.flashMessages.success("Your character has been created.  Please log in.");
                this.router.transitionToRoute('login');
            });
        }
    }
});