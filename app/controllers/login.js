import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    name: '',
    password: '',
    session: service(),
    flashMessages: service(),
    queryParams: [ 'redirect' ],
    
    actions: {
        login() {
            this.session.authenticate('authenticator:ares', { name: this.name, password: this.password})
             .then(() => {
                 
                 if (this.get('model.error')) {
                     return;  // Authenticate does the error printing
                 }
                 
                 this.set('name', '');
                 this.set('password', '');
                 
                 let redirect = this.redirect;
                 if (!redirect) {
                     redirect = '/';
                 }
                 window.location.replace(redirect);
             });
        }
    }
});