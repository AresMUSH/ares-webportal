import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ares-webportal/mixins/unauthenticated-route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Route.extend(UnauthenticatedRouteMixin, {
    gameApi: service(),
    routeIfAlreadyAuthenticated: 'home',
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('loginInfo');
    },
    
    activate: function() {
        this.controllerFor('application').set('hideSidebar', true);
    },

    @action 
    willTransition(transition) {
        this.controllerFor('application').set('hideSidebar', false);
    }
  
});
