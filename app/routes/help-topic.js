import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, RouteResetOnExit, ReloadableRoute, {
    gameApi: service(),
    headData: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('helpTopic', { topic: params['topic']} );
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
