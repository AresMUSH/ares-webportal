import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend(RouteResetOnExit, AuthenticatedRoute, {
  gameApi: service(),
      
  model: function() {
      let api = this.gameApi;
      
      return RSVP.hash({
          characters: api.requestMany('characters', { select: 'all' }),
          sendOptions: api.requestOne('mailSendOptions') })
          .then((model) => EmberObject.create(model));
  },
  
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.setup();
  }
  
  
});
