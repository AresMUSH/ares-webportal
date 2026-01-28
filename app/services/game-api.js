import EmberObject from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Service.extend(AresConfig, {
    flashMessages: service(),
    session: service(),
    router: service(),
  
    errorHandlingInProgress: false,
    
    portalUrl() {
      var base;
      let protocol = this.httpsEnabled ? 'https' : 'http';
      if (`${this.port}` === '80') {
        base = `${protocol}://${this.mushHost}`;
      }
      else {
        base = `${protocol}://${this.mushHost}:${this.webPortalPort}`;
      }
      return base;
    },
    
    serverUrl(route) {
        var base;
        let protocol = this.httpsEnabled ? 'https' : 'http';
        
        if (this.apiProxyEnabled) {
          if (`${this.webPortalPort}` === '80') {
            base = `${protocol}://${this.mushHost}/api`;
          }
          else {
            base = `${protocol}://${this.mushHost}:${this.webPortalPort}/api`;
          }
        } 
        else {
          base = `${protocol}://${this.mushHost}:${this.apiPort}`;
        }
        if (route) {
            return base + "/" + route;
        } else {
            return base;
        }
    },
    
    reportError(error) {
      try {
        if (error.message === 'TransitionAborted') {
          return;
        }
        this.set('errorHandlingInProgress', true);
        let err = new Error();
        console.log(`${error.message} : ${err.stack}`);
        this.router.transitionTo('error', { queryParams: { message: error.message } });
      } catch(ex) { 
          // Failsafe.  Do nothing.
      }
    },
    
    buildFailurePromise(msg) {
      return new Promise((resolve, reject) => {
        console.log(msg);
        reject( {
          error: msg
        });  
      });
    },
    
    async request(cmd, args) {
      if (this.aresconfig === null) {
        this.set('errorHandlingInProgress', true);        
        return this.buildFailurePromise("AresConfig is missing - can't talk to game.");
      }
      
      if (this.errorHandlingInProgress) {
        return this.buildFailurePromise("Recursive error condition - ignoring.");        
      }
            
      let body = {
        cmd: cmd,
        api_key: this.apiKey,
        args: args,
        auth: this.get('session.data.authenticated')
      };     
      
      try {  
        let response = await fetch(this.serverUrl("request"), {
          method: "POST",
          body: JSON.stringify(body)
        });

        if (!response) {
          throw new Error(`No response from game for ${cmd}.`);
        }
        return response.json();        
      }
      catch(ex) {
        this.reportError(ex);
        return this.buildFailurePromise(`No response from game ${cmd}.`);
      }        
    },
    
    // Pass null to transitionToOnError to stay on the page (so you can show a failure message)
    requestOne(cmd, args = {}, transitionToOnError = 'home') {
        return this.request(cmd, args).then((response) => {
          if (!response) {
            this.reportError({ message: `No response from game for ${cmd}.` });
          }
          else if (response.error) {
                this.flashMessages.danger(response.error);
                if (transitionToOnError) {
                    this.router.transitionTo(transitionToOnError);
                }
                return response;
            }
            return EmberObject.create(response);
        });
    },

    // Pass null to transitionToOnError to stay on the page (so you can show a failure message)
    requestMany(cmd, args = {}, transitionToOnError = 'home') {    
        return this.request(cmd, args).then((response) => {
          if (!response) {
            this.reportError({ message: `No response from game for ${cmd}.` });
          }
          else if (response.error) {
                this.flashMessages.danger(response.error);
                if (transitionToOnError) {
                    this.router.transitionTo(transitionToOnError);
                }
                return [];
            }
            return response.map(r => EmberObject.create(r));
        });
    }    
    
});
