import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('combatant', { id: params['id'] });
    }
});
