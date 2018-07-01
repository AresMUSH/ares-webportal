import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(RestrictedRoute, ReloadableRoute, {
    gameApi: service(),
    session: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('job', {id: params['id'] });
    }    
});
