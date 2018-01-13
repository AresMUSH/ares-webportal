import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
    flashMessages: service(),
    session: service(),
    
    server_url(route) {
        let base = "http://" + aresconfig.host + ":" + aresconfig.api_port;
        if (route) {
            return base + "/" + route;
        } else {
            return base;
        }
    },
    
    query(cmd, args) {
     return $.post(this.server_url("request"), 
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
    
    queryOne(cmd, args) {
        return this.query(cmd, args).then((response) => {
            if (response.error) {
                this.get('flashMessages').danger(response.error);
                return response;
            }
            return Ember.Object.create(response);
        });
    },

    queryMany(cmd, args) {    
        return this.query(cmd, args).then((response) => {
            if (response.error) {
                this.get('flashMessages').danger(response.error);
                return [];
            }
            return response.map(r => Ember.Object.create(r));
        });
    }    
    
});
