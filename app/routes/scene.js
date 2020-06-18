import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(ReloadableRoute, RouteResetOnExit, DefaultRoute, {
    gameApi: service(),
    headData: service(),
        
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('scene', { id: params['id'] })
            .then(response => { 
                if (response.unshared) {
                    this.transitionTo('scene-live', params['id']);
                } 
                return response;
            });
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
