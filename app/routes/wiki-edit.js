import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, RouteResetOnExit, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('wikiPage', { id: params['id'], edit_mode: true });
    }
});
