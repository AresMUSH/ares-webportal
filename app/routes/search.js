import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    queryParams: {term: { refreshModel:true } },
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('searchSite', { search: params['term'] });
    }
});
