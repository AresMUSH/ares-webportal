import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    headData: service(),
    
    model: function() {
        let api = this.gameApi;
        return api.requestMany('plots');
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
