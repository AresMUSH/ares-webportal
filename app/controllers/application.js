import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webclient/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    session: service('session'),
    hideSidebar: false,

    currentRoute: function() {
        return window.location;
    }.property(),
    
    mushName: function() { 
        return aresconfig.mu_name;
    }.property(),
    
    mushPort: function() {
        return aresconfig.port;        
    }.property(),
    
    mushHost: function() {
        return aresconfig.host;        
    }.property(),
    
    mushVersion: function() {
        return aresconfig.version;
    }.property(),
    
    currentUser: function() {
        return this.get('session.data.authenticated');
    }.property(),
    
    actions: {
        logout() {
          this.get('session').invalidate();
        }
      }
});