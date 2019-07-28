import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import { inject as service } from '@ember/service';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('appReview', { id: params['id'] });
    }
});
