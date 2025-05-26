import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ares-webportal/mixins/unauthenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
    gameApi: service(),
    routeIfAlreadyAuthenticated: 'play',
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('loginInfo');
    }
});
