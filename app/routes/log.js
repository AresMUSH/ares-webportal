import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webportal/mixins/admin-route';

export default Route.extend(AdminRoute, {
    gameApi: service(),
    session: service(),
    titleToken: function(model) {
        return model.name;
    },
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('log', { file: params['file']});
    },
    
    
});
