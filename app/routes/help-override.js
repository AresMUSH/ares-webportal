import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('helpTopic', { topic: params['topic']} );
    }
});
