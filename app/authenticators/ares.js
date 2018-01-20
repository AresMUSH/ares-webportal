import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import Promise from 'rsvp';

export default Base.extend({
    ajax: service(),

    restore(data) {
        
        let aj = this.get('ajax');
        return aj.queryOne('checkToken', { id: data.id, token: data.token })
        .then((response) => {
            if (response.token_valid) {
                this.set('data', data);
                return Promise.resolve(data);
            }
            return Promise.reject(response);            
        });    
    },
    
    authenticate(options) {
        let aj = this.get('ajax');
        return aj.queryOne('login', { name: options.name, password: options.password }, null)
        .then((response) => {
            if (response.id) {
                this.set('data', response);
                return Promise.resolve(response);
            }
            return Promise.reject(response);            
        });
    },
    invalidate() {
        return Promise.resolve();
    }
});