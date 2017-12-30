import Service from '@ember/service';

export default Service.extend({
    
    check_for_error(response) {
        if (response.error) {
            console.log("ERROR: " + response.error);
            Ember.getOwner(this).lookup('router:main').transitionTo('report-error', { queryParams: { message: response.error } })
        }
    },
    
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
            api_key: aresconfig.api_key
        }).then((response) => {
           this.check_for_error(response);
           return response;
        }).catch(() => {
                    Ember.getOwner(this).lookup('router:main').transitionTo('report-error', { queryParams: { message: "There was a problem connecting to the game." }}) });
    },
    
    queryOne(cmd, args) {
        return this.query(cmd, args).then((response) => {
            return Ember.Object.create(response);
        });
    },

    queryMany(cmd, args) {    
        return this.query(cmd, args).then((response) => {
            return response.map(r => Ember.Object.create(r));
        });
    }    
    
});
