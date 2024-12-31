import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import { action } from '@ember/object';

export default Route.extend(RestrictedRoute, {
  gameSocket: service(),

  model: function() {
    return this.modelFor('application');
  },
    
  activate: function() {
    this.controllerFor('manage').setupCallback();
  },

  @action 
  willTransition(transition) {
    this.gameSocket.removeCallback('manage_activity');
  },
});
