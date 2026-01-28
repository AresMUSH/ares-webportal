import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import Promise from 'rsvp';

export default Base.extend({
    gameApi: service(),
    session: service(),
    gameSocket: service(),
    router: service(),

    restore(data) {
        
        let old = this.get('session.data.authenticated') || {};
        console.log("ALT DEBUG: Restoring session.");
                    
        if (old.id && old.id != data.id) {
          console.log("ALT DEBUG: Switching characters.");
          this.router.transitionTo("home");
        }
        
        let api = this.gameApi;
        
        if (api.errorHandlingInProgress) {
           return Promise.reject({});
        }
        
        try {
          console.log("ALT DEBUG: Checking token");
          return api.requestOne('checkToken', { id: data.id, token: data.token })
          .then((response) => {
            console.log("ALT DEBUG: Got token response back");
              if (response.token) {
                  this.set('data', response);
                  console.log(`ALT DEBUG: Token checked: ${data.name}`);
                  this.gameSocket.sessionStarted(data.id);
                  return Promise.resolve(data);
              }
              console.log(`Error checking token: ${response.error}`);
              this.session.invalidate();
              return Promise.reject(response);            
          });    
        } catch (error) {
          console.log(`Error checking token: ${error}`);
          this.session.invalidate();
          return Promise.reject(response);    
        }
    },
    
    authenticate(options) {
        let api = this.gameApi;
        return api.requestOne('login', { name: options.name, password: options.password }, null)
        .then((response) => {
          console.log("ALT DEBUG: Authenticated.");
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
      console.log("ALT DEBUG: Invalidated.");
        this.gameSocket.sessionStopped();
        return Promise.resolve();
    }
});