import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(RouteResetOnExit, AuthenticatedRoute, {    
    gameApi: service(),

    model: function() {
      let api = this.gameApi;

      return RSVP.hash({
           app: this.modelFor('application'),
           characters: api.requestMany('characters', { select: 'include_staff' }),
           sceneOptions: api.requestOne('sceneOptions')
         })
         .then((model) => EmberObject.create(model));
         
    }
});
