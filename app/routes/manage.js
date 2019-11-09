import $ from "jquery"
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(RestrictedRoute, RouteResetOnExit, {
    gameSocket: service(),

    model: function() {
        return this.modelFor('application');
    },
    
    activate: function() {
        this.controllerFor('manage').setupCallback();
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
      this.gameSocket.removeCallback('manage_activity');
    },
});
