import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    session: service('session'),
    gameSocket: service(),
    hideSidebar: false,
    refreshSidebar: false,
    sidebarModel: {},

    currentRoute: function() {
        return window.location;
    }.property(),
    
    mushName: function() { 
        return this.get('model.game.name');
    }.property(),
    
    mushPort: function() {
        return aresconfig.mush_port;        
    }.property(),
    
    mushHost: function() {
        return aresconfig.host;        
    }.property(),
    
    mushVersion: function() {
        return aresconfig.version;
    }.property(),
    
    portalVersion: function() {
      return aresweb_version;
    }.property(),
    
    currentUser: function() {
        return this.get('session.data.authenticated');
    }.property(),
    
    sidebar: function() {
        return this.get('model');
    }.property('refreshSidebar')
});