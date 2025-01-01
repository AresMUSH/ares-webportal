import EmberObject from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Service.extend(AresConfig, {
    flashMessages: service(),
    session: service(),
    router: service(),
    
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
    
    request(cmd, args, allowEpicFail = false) {
      if (this.aresconfig === null) {
        return buildFailurePromise("AresConfig is missing - can't load page");
      }
      
      const body = new FormData();
      body.append("cmd", cmd);
      body.append("api_key", this.apiKey);
      
      if (args) {
        for (let key in args) {
          body.append(`args[${key}]`, args[key]);
        }
      }
      
      if (this.get('session.isAuthenticated')) {
        const auth = this.get('session.data.authenticated');
        for (let key in auth) {
          body.append(`auth[${key}]`, auth[key]);
        }        
      }
      
      try {  
        return fetch(this.serverUrl("request"), {
          method: "POST",
          body: body
        }).then((response) => {
          if (!response) {
            throw new Error(`No response from game for ${cmd}`);
          }
          return response.json();
        }).catch((ex) => {
          this.reportError(ex);
          return buildFailurePromise(`No response from game for $(cmd).`);          
        });
      }
      catch(ex) {
        this.reportError(ex);
        return buildFailurePromise(`No response from game for $(cmd).`);
      }        
    },
    
    requestOne(cmd, args = {}, transitionToOnError = 'home', allowEpicFail = false) {
        return this.request(cmd, args, allowEpicFail).then((response) => {
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

    requestMany(cmd, args = {}, transitionToOnError = 'home', allowEpicFail = false) {    
        return this.request(cmd, args, allowEpicFail).then((response) => {
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
