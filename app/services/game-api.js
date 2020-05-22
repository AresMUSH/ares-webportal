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
      var protocol = aresconfig.use_https ? 'https' : 'http';
      if (`${aresconfig.web_portal_port}` === '80') {
        base = `${protocol}://${aresconfig.host}`;
      }
      else {
        base = `${protocol}://${aresconfig.host}:${aresconfig.web_portal_port}`;
      }
      return base;
    },
    
    serverUrl(route) {
        var base;
        var protocol = aresconfig.use_https ? 'https' : 'http';
        if (aresconfig.use_api_proxy) {
          if (`${aresconfig.web_portal_port}` === '80') {
            base = `${protocol}://${aresconfig.host}/api`;
          }
          else {
            base = `${protocol}://${aresconfig.host}:${aresconfig.web_portal_port}/api`;
          }
        } 
        else {
          base = `${protocol}://${aresconfig.host}:${aresconfig.api_port}`;
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
                    api_key: aresconfig.api_key
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
    
    request(cmd, args) {
     return $.post(this.serverUrl("request"), 
        {
            cmd: cmd,
            args: args,
            api_key: aresconfig.api_key,
            auth: this.get('session.data.authenticated')
        }).then((response) => {
            if (!response) {
              this.reportError({ message: `No response from game for ${cmd}.` });
            }
            else if (response.error) {
                return response;
            }
           return response;
        }).catch(ex => {
          this.reportError(ex);
        });
    },
    
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
