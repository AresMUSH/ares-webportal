import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, RouteResetOnExit, {
  gameApi: service(),
  gameSocket: service(),
  
  model: function() {
    let api = this.gameApi;
    return RSVP.hash({
      sceneTypes: api.requestMany('sceneTypes'),
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
