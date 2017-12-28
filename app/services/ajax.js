import Service from '@ember/service';

export default Service.extend({
    routing: Ember.inject.service('-routing'),
    
    check_for_error(response) {
        if (response.error) {
            this.get("routing").transitionTo('report-error', { queryParams: { message: response.error } })
        }
    },
    
    server_url() {
        return "http://" + aresconfig.host + ":" + aresconfig.api_port + "/request";
    },
    
    queryOne(cmd, args) {
        return $.post(this.server_url(), 
           {
               cmd: cmd,
               args: args,
               api_key: aresconfig.api_key
           }).then((response) => {
                  this.check_for_error(response);
                  return Ember.Object.create(response);
               });
    },

    queryMany(cmd, args) {    
       return $.post(this.server_url(), 
       {
           cmd: cmd,
           args: args,
           api_key: aresconfig.api_key
       }).then((response) => {
               this.check_for_error(response);
               return response.map(r => Ember.Object.create(r));
           }
        );
    }    
    
});
