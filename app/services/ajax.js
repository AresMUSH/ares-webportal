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
    
    getApiKey() {
        return $.getJSON(this.server_url("api-key"),{}).then((response) => {
               return response['key'];
               });
    },
    
    query(cmd, args) {
        return this.getApiKey().then((api_key) => {
            
         return $.post(this.server_url("request"), 
            {
                cmd: cmd,
                args: args,
                api_key: api_key
            }).then((response) => {
               this.check_for_error(response);
               return response;
            });
        })
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
