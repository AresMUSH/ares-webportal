import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(DefaultRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('jobOptions');
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.set('category', model.get('request_category'));
    }
});
