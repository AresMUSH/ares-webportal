import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import Promise from 'rsvp';

export default Base.extend({
    gameApi: service(),
    session: service(),
    gameSocket: service(),

    restore(data) {
        let old = this.get('session.data.authenticated');
        if (old.id && old.id != data.id) {
          window.location.replace(window.location || '/');
        }
        
        let api = this.gameApi;
        return api.requestOne('checkToken', { id: data.id, token: data.token })
        .then((response) => {
            if (response.token) {
                this.set('data', response);
                this.gameSocket.sessionStarted(data.id);
                return Promise.resolve(data);
            }
            this.session.invalidate();
            return Promise.reject(response);            
        });    
    },
    
    authenticate(options) {
        let api = this.gameApi;
        return api.requestOne('login', { name: options.name, password: options.password }, null)
        .then((response) => {
            if (response.id) {
                this.set('data', response);
                this.gameSocket.sessionStarted(response.id);
                return Promise.resolve(response);
            }
            this.session.invalidate();
            return Promise.reject(response);            
        });
    },
    
    invalidate() {
        this.gameSocket.sessionStopped();
        return Promise.resolve();
    }
});