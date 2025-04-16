import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Route.extend(AresConfig, {

  gameApi: service(),
  session: service(),
  router: service(),
  flashMessages: service(),
  gameSocket: service(),
  favicon: service(),
  router: service('router'),
  headData: service(),
  gameDown: false,
  
  init() {
    this._super(...arguments);
    let self = this;
    this.router.on('routeDidChange', function() {
      self.doReload();
    });    
    
    window.addEventListener("error", function(error) {
      self.gameApi.reportError(error);
    });
    
  },
  async beforeModel() {
    await this.session.setup();
  },
  afterModel(model) {
    if (this.get('gameDown')) return;
    
    try {
      this.set('headData.mushName', model.get('game.name'));
      this.set('headData.portalUrl', this.gameApi.portalUrl());
      this.set('headData.mushDesc', model.get('game.description')); 
    }
    catch(error) {
      console.log(`Error loading head metadata.`);
      console.log(error);
      // Don't do anything here.
    }
  },
  doReload: function() {
    this.loadModel().then( newModel => {
      this.controllerFor('application').set('sidebar', newModel);
      this.controllerFor('application').set('refreshSidebar', newModel.timestamp);
      this.gameSocket.updateNotificationBadge(newModel.notification_count);
    });        
  },
  
  buildGameDownPromise: function() {
    return new Promise((resolve, reject) => {
      resolve( {
        game_down: true
      });  
    });
  },
  
  loadModel: function() {
    let api = this.gameApi;
    
    if (this.get('gameDown')) {
      return this.buildGameDownPromise();
    }
    
    return api.requestOne('sidebarInfo')
    .then( (response) => {
      if (response.error) {
        this.set('gameDown', true);
      }
      response['socketConnected'] = this.get('gameSocket.connected');
            
      if (response.token_expiry_warning) {
        this.flashMessages.warning(`Your login expires today (in ${response.token_expiry_warning}). You should log out and back in before that happens so you don't lose any work.`);
      }
      return response;
    })
    .catch(() => {
      this.set('gameDown', true);   
      return this.buildGameDownPromise();         
    });  
  },
    
  model: function() {       
    let gameSocket = this.gameSocket;
    let self = this;
    gameSocket.checkSession(this.get('session.data.authenticated.id'));
    
    window.addEventListener("focus", function(event) {
      self.favicon.changeFavicon(false);                    
    });
    
    return this.loadModel();
  },

  sessionAuthenticated: function() {
    //Do nothing.
  },
    
  sessionInvalidated: function() { 
    this.flashMessages.info('You have been logged out.');
    this.router.transitionTo('/');
    this.refresh();
  }
});
