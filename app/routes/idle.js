import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(ReloadableRoute, RestrictedRoute, RouteResetOnExit, {
    gameApi: service(),
        
    model: function() {
        let api = this.gameApi;
        return api.requestOne('idleReview');
    }
});
