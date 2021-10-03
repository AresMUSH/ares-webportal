import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, RouteResetOnExit, {
    gameApi: service(),
    routeIfAlreadyAuthenticated: 'home',
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('loginInfo');
    }
});
