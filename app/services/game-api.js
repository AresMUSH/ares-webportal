import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
    flashMessages: service(),
    session: service(),
    routing: service('-routing'),
    
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
        $.post(this.serverUrl("request"), 
                {
                    cmd: 'webError',
                    args: { error: `${error} : ${error.stack}` },
                    api_key: aresconfig.api_key
                });
        Ember.getOwner(this).lookup('router:main').transitionTo('error', { queryParams: { message: "Client error." }});
      } catch(ex) { 
        // Failsafe.  Do nothing.
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
              Ember.getOwner(this).lookup('router:main').transitionTo('error', { queryParams: { message: "Empty response from game." }});
            }
            else if (response.error) {
                return response;
            }
           return response;
        }).catch(ex => {
              Ember.getOwner(this).lookup('router:main').transitionTo('error', { queryParams: { message: "There was a problem connecting to the game.  It may be down." }}) });
    },
    
    requestOne(cmd, args = {}, transitionToOnError = 'home') {
        return this.request(cmd, args).then((response) => {
            if (response.error) {
                this.get('flashMessages').danger(response.error);
                if (transitionToOnError) {
                    this.get("routing").transitionTo(transitionToOnError);
                }
                return response;
            }
            return Ember.Object.create(response);
        });
    },

    requestMany(cmd, args = {}, transitionToOnError = 'home') {    
        return this.request(cmd, args).then((response) => {
            if (response.error) {
                this.get('flashMessages').danger(response.error);
                if (transitionToOnError) {
                    this.get("routing").transitionTo(transitionToOnError);
                }
                return [];
            }
            return response.map(r => Ember.Object.create(r));
        });
    }    
    
});
