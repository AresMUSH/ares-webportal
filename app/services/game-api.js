import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
    flashMessages: service(),
    session: service(),
    routing: service('-routing'),
    
    serverUrl(route) {
        var base;
        var url;
        var protocol = aresconfig.use_https ? 'https' : 'http';
        if (aresconfig.use_api_proxy) {
          url = new URL('/api',window.location.href);
          url.port = window.location.port === "" ? ( window.location.protocol === "https:" ? 443 : 80 ) : window.location.port
        } 
        else {
          url = new URL(window.location.href);
          url.port = aresconfig.api_port;
        }
        base = url.href;
        if (route) {
            return base + "/" + route;
        } else {
            return base;
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
            if (response.error) {
                return response;
            }
           return response;
        }).catch(() => {
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
