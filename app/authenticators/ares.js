import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import Promise from 'rsvp';

export default Base.extend({
    gameApi: service(),
    gameSocket: service(),

    restore(data) {
        
        let api = this.get('gameApi');
        return api.requestOne('checkToken', { id: data.id, token: data.token })
        .then((response) => {
            if (response.token) {
                this.set('data', response);
                this.get('gameSocket').sessionStarted(data.id);
                return Promise.resolve(data);
            }
            this.get('gameSocket').sessionStopped();
            return Promise.reject(response);            
        });    
    },
    
    authenticate(options) {
        let api = this.get('gameApi');
        return api.requestOne('login', { name: options.name, password: options.password }, null)
        .then((response) => {
            if (response.id) {
                this.set('data', response);
                this.get('gameSocket').sessionStarted(response.id);
                return Promise.resolve(response);
            }
            this.get('gameSocket').sessionStopped();
            return Promise.reject(response);            
        });
    },
    invalidate() {
        this.get('gameSocket').sessionStopped();
        return Promise.resolve();
    }
});