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
      if (`${port}` === '80') {
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
          if (`${port}` === '80') {
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
        console.log(error);
        
        let err = new Error();
        $.post(this.serverUrl("request"), 
                {
                    cmd: 'webError',
                    args: { error: `${error.message} : ${err.stack}` },
                    api_key: this.apiKey
                });
                this.router.transitionTo('error');
      } catch(ex) { 
        try {
          this.router.transitionTo('error');
        }
        catch(ex) {
          // Failsafe.  Do nothing.
        }
      }
    },
    
    request(cmd, args, allowEpicFail = false) {
      
      if (this.aresconfig === null) {
        return new Promise((resolve, reject) => {
          console.log("Unable to send request - aresconfig is missing.");
          reject( {
            error: "Unable to send request - aresconfig is missing."
          });  
        });
      }
      
     return $.post(this.serverUrl("request"), 
        {
            cmd: cmd,
            args: args,
            api_key: this.apiKey,
            auth: this.get('session.data.authenticated')
        }).then((response) => {
            if (!response) {
              if (allowEpicFail) {
                return { error: "The game didn't respond. Try again, or save your work and refresh the page." };
              } else {
                this.reportError({ message: `No response from game for ${cmd}.` });
              }
            }
            else if (response.error) {
                return response;
            }
           return response;
        }).catch(ex => {
          if (allowEpicFail) {
            return { error: "The game didn't respond. Try again, or save your work and refresh the page." };
          } else {
            this.reportError(ex);
          }
        });
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
