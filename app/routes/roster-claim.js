import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('character', { id: params['id'] });
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
});
