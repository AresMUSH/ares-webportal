import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    session: service(),
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('logs');
    },
    
    
});
