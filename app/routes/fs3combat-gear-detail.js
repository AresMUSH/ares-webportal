import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    headData: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('gearDetail', {type: params['type'], name: params['name']});
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
