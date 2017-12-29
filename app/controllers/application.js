import Controller from '@ember/controller';

export default Controller.extend({
    mush_name: function() { 
        return aresconfig.mu_name;
    }.property(),
    
    mush_port: function() {
        return aresconfig.port;        
    }.property(),
    
    mush_host: function() {
        return aresconfig.host;        
    }.property(),
    
    mush_version: function() {
        return aresconfig.version;
    }.property()
});