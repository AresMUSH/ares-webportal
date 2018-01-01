import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service('session'),
    flashMessages: service(),
    hideSidebar: false,

    current_route: function() {
        return window.location;
    }.property(),
    
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
    }.property(),
    
    player_name: function() {
        let data = this.get('session');
        return this.get('session.data.authenticated.name');
    }.property(),
    
    actions: {
        logout() {
          this.get('session').invalidate();
        }
      }
});