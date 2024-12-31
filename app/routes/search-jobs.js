import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import { action } from '@ember/object';

export default Route.extend(DefaultRoute, {
  gameApi: service(),
  gameSocket: service(),
  
  model: function() {
    return this.gameApi.requestOne('jobOptions');
  },
  
  activate: function() {
      this.controllerFor('search-jobs').setupCallback();
  },

  @action 
  willTransition(transition) {
      this.gameSocket.removeCallback('search_results');
  },
  
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.setup(model);
  }
  
});
