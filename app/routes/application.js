import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Route.extend(ApplicationRouteMixin, ReloadableRoute, AresConfig, {

    gameApi: service(),
    session: service(),
    flashMessages: service(),
    gameSocket: service(),
    favicon: service(),
    headData: service(),
    router: service('router'),
    init() {
        this._super(...arguments);
        let self = this;
        this.router.on('routeDidChange', function() {
          self.doReload();
        });
    },
    afterModel(model) {
      try {
        this.set('headData.mushName', model.get('game.name'));
        this.set('headData.portalUrl', this.gameApi.portalUrl());
        this.set('headData.mushDesc', model.get('game.description'));  
        }
        catch(error) {
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
    
    loadModel: function() {
        let api = this.gameApi;
        return api.requestOne('sidebarInfo')
        .then( (response) => {
            if (response.error) {
                return { game_down: true };
            }
            response['socketConnected'] = this.get('gameSocket.connected');
            
            if (response.token_expiry_warning) {
              this.flashMessages.warning(`Your login expires today (in ${response.token_expiry_warning}). You should log out and back in before that happens so you don't lose any work.`);
            }
            return response;
        })
        .catch(() => {
            return { game_down: true };
        });  
    },
    
    model: function() {       
        let gameSocket = this.gameSocket;
        gameSocket.checkSession(this.get('session.data.authenticated.id'));
      
        $(window).focus( () => {
            this.favicon.changeFavicon(false);                    
        });
        
        return this.loadModel();
    },

    sessionAuthenticated: function() {
        //Do nothing.
    },
    
    sessionInvalidated: function() { 
        this.flashMessages.info('You have been logged out.');
        this.transitionTo('/');
        this.refresh();
    },
    
    title: function(tokens) {
        var gameName = aresconfig.game_name;
        if (tokens.length > 0) {
            let tokenString = tokens.reverse().join(' - ');
            return `${tokenString} - ${gameName}`
        }
        else {
            return gameName;
        }
    },

    actions: {
        error(error) {
            this.gameApi.reportError({ message: error });
        }
    }
});
