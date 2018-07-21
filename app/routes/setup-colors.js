import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';

export default Route.extend(ReloadableRoute, RestrictedRoute, {
    gameApi: service(),
        
    model: function() {
        let api = this.get('gameApi');
        return api.requestMany('getColors');
    }
});
