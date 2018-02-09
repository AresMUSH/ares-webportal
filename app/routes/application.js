import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(ApplicationRouteMixin, ReloadableRoute, {

    ajax: service(),
    session: service(),
    flashMessages: service(),
    notifications: service(),
    
    sessionAuthenticated: function() {
        //Do nothing.
    },
    
    sessionInvalidated: function() { 
        this.get('flashMessages').info('You have been logged out.');
        this.transitionTo('/');
        this.refresh();
    },
    
    model: function() {       
        let notifications = this.get('notifications');
        notifications.checkSession(this.get('session.data.authenticated.id'));
        
         
        let aj = this.get('ajax');
        return aj.requestOne('sidebarInfo')
        .then( (response) => {
            if (response.error) {
                return { game_down: true };
            }
            return response;
        })
        .catch(() => {
            return { game_down: true };
        });
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
            this.refresh();
        }
    }
});
