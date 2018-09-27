import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
    flashMessages: service(),
    session: service(),
    routing: service('-routing'),
    
    serverUrl(route) {
        var base;
        if (aresconfig.use_api_proxy) {
            base = "https://" + aresconfig.host + ":" + aresconfig.web_portal_port + "/api";
        } 
        else {
            base = "https//" + aresconfig.host + ":" + aresconfig.api_port;
        }
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
