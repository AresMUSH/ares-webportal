import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(DefaultRoute, ConfirmAction, RouteResetOnExit, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('area', { id: params['id'] });
    },
});
