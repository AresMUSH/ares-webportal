import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, RouteResetOnExit, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.gameApi;
        
        return RSVP.hash({
             scene:  api.requestOne('scene', { id: params['id'], edit_mode: true  }),
             sceneOptions: api.requestOne('sceneOptions'),
             plots: api.requestMany('plots'),
             characters: api.requestMany('characters', { select: 'include_staff' }),
             scenes: api.requestOne('scenes', { filter: 'Related' })
           })
           .then((model) => EmberObject.create(model));
    },
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
});
