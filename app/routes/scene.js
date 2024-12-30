import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    router: service(),
        
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('scene', { id: params['id'] })
            .then(response => { 
                if (response.unshared) {
                    this.router.transitionTo('scene-live', params['id']);
                } 
                return response;
            });
    }
});
