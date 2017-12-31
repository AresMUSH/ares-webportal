import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    name: '',
    password: '',
    confirm_password: '',
    session: service(),
    flashMessages: service(),
    ajax: service(),
    
    actions: {
        register() {
            
            let response = this.get('ajax').queryOne('register', 
               { name: this.get('name'), password: this.get('password'), confirm_password: this.get('confirm_password')})
            
            if (response.error) {
                this.get('flashMessages').danger(response.error);
                return;
            }
            
            this.get('session').restore('authenticator:ares', response)
             .then(() => {
                 
                 let name = this.get('session.data.authenticated.name');
                 this.get('flashMessages').success(`Welcome, ${name}!`);
                 this.set('name', '');
                 this.set('password', '');
                 
                 this.transitionToRoute('home');
             })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});