import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(ApplicationRouteMixin, ReloadableRoute, {

    gameApi: service(),
    session: service(),
    flashMessages: service(),
    gameSocket: service(),
    favicon: service(),
    
    doReload: function() {
        this.loadModel().then( newModel => {
            this.controllerFor('application').set('sidebar', newModel);
            this.controllerFor('application').set('refreshSidebar', newModel.timestamp);
        });        
    },
    
    loadModel: function() {
        let api = this.get('gameApi');
        return api.requestOne('sidebarInfo')
        .then( (response) => {
            if (response.error) {
                return { game_down: true };
            }
            response['socketConnected'] = this.get('gameSocket.connected');
            
            if (response.token_expiry_warning) {
              this.get('flashMessages').warning(`Your login expires today (in ${response.token_expiry_warning}). You should log out and back in before that happens so you don't lose any work.'`);
            }
            return response;
        })
        .catch(() => {
            return { game_down: true };
        });  
    },
    
    model: function() {       
        let gameSocket = this.get('gameSocket');
        gameSocket.checkSession(this.get('session.data.authenticated.id'));
      
        $(window).focus( () => {
            this.get('favicon').changeFavicon(false);                    
        });
        
        return this.loadModel();
    },

    sessionAuthenticated: function() {
        //Do nothing.
    },
    
    sessionInvalidated: function() { 
        this.get('flashMessages').info('You have been logged out.');
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
        willTransition() {
           this.doReload();
        },
        error(error) {
            this.get('gameApi').reportError({ message: error });
        }
    }
});
