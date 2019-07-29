import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, RouteResetOnExit, {
    gameApi: service(),
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('roster');
    }
});
