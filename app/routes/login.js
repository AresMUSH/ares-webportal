import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ares-webportal/mixins/unauthenticated-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, RouteResetOnExit, {
    gameApi: service(),
    routeAfterAuthentication: 'login',

    activate: function() {
        this.controllerFor('application').set('hideSidebar', true);
    },

    deactivate: function() {
        this.controllerFor('application').set('hideSidebar', false);
    },    

    model: function() {
        let api = this.gameApi;
        return api.requestOne('loginInfo');
    }
});
