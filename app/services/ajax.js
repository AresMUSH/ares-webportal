import Service from '@ember/service';

export default Service.extend({
    queryOne(cmd, args) {
        return $.post("http://" + aresconfig.host + ":" + aresconfig.api_port + "/query", 
           {
               cmd: cmd,
               args: args
           }).then(
               function(response) {
                  return Ember.Object.create(response);
               });
    },

    queryMany(cmd, args) {    
       return $.post("http://" + aresconfig.host + ":" + aresconfig.api_port + "/query", 
       {
           cmd: cmd,
           args: args
       }).then(
           function(response) {
               return response.map(r => Ember.Object.create(r));
           }
        );
    }    
    
});
