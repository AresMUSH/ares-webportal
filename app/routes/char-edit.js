import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('profileEdit', { id: params['id'] });
    },
    
    titleToken: function(model) {
        return `Edit ${model.name}`;
    }
});
