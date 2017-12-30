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
            this.get('session').authenticate('authenticator:ares', { name: this.get('name'), password: this.get('password')})
             .then(() => {
                 let name = this.get('session.data.authenticated.name');
                 this.get('flashMessages').success(`Welcome, ${name}!`);
                 this.set('name', '');
                 this.set('password', '');
                 
                 let redirect = this.get('redirect');
                 if (!redirect) {
                     redirect = 'home';
                 }
                 window.location.replace(redirect);
             })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});