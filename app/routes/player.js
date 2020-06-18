import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    gameApi: service(),
    headData: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('player', { id: params['id'] });
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
