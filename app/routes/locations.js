import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    headData: service(),
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('locations');
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
