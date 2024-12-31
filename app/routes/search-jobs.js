import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
  gameApi: service(),
  gameSocket: service(),
  
  model: function() {
    return this.gameApi.requestOne('jobOptions');
  },
  
  activate: function() {
      this.controllerFor('search-jobs').setupCallback();
      $(window).on('beforeunload', () => {
          this.deactivate();
      });
  },

  deactivate: function() {
      this.gameSocket.removeCallback('search_results');
  },
  
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.setup(model);
  }
  
});
