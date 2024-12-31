import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

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
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
      this.gameSocket.removeCallback('combat_activity');
      this.gameSocket.removeCallback('new_combat_turn');
    },
    
});
