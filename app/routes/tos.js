import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import UnauthenticatedRoute from 'ares-webportal/mixins/unauthenticated-route';
import { action } from '@ember/object';

export default Route.extend(UnauthenticatedRoute, {
    gameApi: service(),

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
