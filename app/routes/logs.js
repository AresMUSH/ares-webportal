import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webportal/mixins/admin-route';

export default Route.extend(AdminRoute, {
    gameApi: service(),
    session: service(),
    titleToken: 'Logs',
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('logs');
    },
    
    
});
