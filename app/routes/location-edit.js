import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    session: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('area', {id: params['id'], edit_mode: true });
    }
});
