import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webportal/mixins/admin-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(AdminRoute, ReloadableRoute, {
    gameApi: service(),
    session: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('job', {id: params['id'] });
    },
    
    titleToken: function(model) {
        return `Job ${model.id}`;
    }
    
});
