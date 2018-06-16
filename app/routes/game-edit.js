import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';

export default Route.extend(RestrictedRoute, {
    gameApi: service(),
    session: service(),
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('editGame');
    }    
});
