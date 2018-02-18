import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import Promise from 'rsvp';

export default Base.extend({
    ajax: service(),
    notifications: service(),

    restore(data) {
        
        let aj = this.get('ajax');
        return aj.requestOne('checkToken', { id: data.id, token: data.token })
        .then((response) => {
            if (response.token) {
                this.set('data', response);
                this.get('notifications').sessionStarted(data.id);
                return Promise.resolve(data);
            }
            this.get('notifications').sessionStopped();
            return Promise.reject(response);            
        });    
    },
    
    authenticate(options) {
        let aj = this.get('ajax');
        return aj.requestOne('login', { name: options.name, password: options.password }, null)
        .then((response) => {
            if (response.id) {
                this.set('data', response);
                this.get('notifications').sessionStarted(response.id);
                return Promise.resolve(response);
            }
            this.get('notifications').sessionStopped();
            return Promise.reject(response);            
        });
    },
    invalidate() {
        this.get('notifications').sessionStopped();
        return Promise.resolve();
    }
});