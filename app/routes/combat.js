import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, RouteResetOnExit, ReloadableRoute, {
    gameApi: service(),
    gameSocket: service(),
  
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('combat', { id: params['id'] });
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
