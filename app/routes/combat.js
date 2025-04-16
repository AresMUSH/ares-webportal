import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import { action } from '@ember/object';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
  
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('combat', { id: params['id'] });
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    },
    
    activate: function() {
      this.controllerFor('combat').setupCallback();
    },
    
    @action 
    willTransition(transition) {
      this.gameSocket.removeCallback('combat_activity');
      this.gameSocket.removeCallback('new_combat_turn');
    }    
});
