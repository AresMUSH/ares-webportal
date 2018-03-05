import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AdminRoute from 'ares-webportal/mixins/admin-route';

export default Route.extend(ReloadableRoute, AdminRoute, {
    gameApi: service(),
    titleToken: 'Setup',
        
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('getSetupIndex');
    }
});
