import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {

    ajax: service(),
    flashMessages: service(),
   
    sessionAuthenticated: function() {
        //Do nothing.
    },
    
    sessionInvalidated: function() { 
        this.get('flashMessages').info('You have been logged out.');
        this.transitionTo('/');
        this.refresh();
    },
    
    model: function() {        
        let aj = this.get('ajax');
        return aj.queryOne('sidebarInfo', {})
            .then( (response) => {
                if (response.error) {
                    return { game_down: true };
                }
                return response;
            })
            .catch((response) => {
                return { game_down: true };
            });;
    },

    title: function(tokens) {
        let mushName = aresconfig.mu_name;
        if (tokens.length > 0) {
            return tokens.reverse().join(' - ') + " - " + mushName;
        }
        else {
            return mushName;
        }
    }
 });
