import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  gameApi: service(),
  gameSocket: service(),
  
  model: function() {
    let api = this.gameApi;
    return RSVP.hash({
      sceneOptions: api.requestOne('sceneOptions'),
    })
    .then((model) => EmberObject.create(model));
         
  },
  
  activate: function() {
      this.controllerFor('search-scenes').setupCallback();
      $(window).on('beforeunload', () => {
          this.deactivate();
      });
  },

  deactivate: function() {
      this.gameSocket.removeCallback('search_results');
  },
  
});
