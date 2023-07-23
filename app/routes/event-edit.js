import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    session: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
             event: api.requestOne('event', {event_id: params['event_id'], edit_mode: true }),
             characters: api.requestMany('characters', { select: 'include_staff' }),
             sceneOptions: api.requestOne('sceneOptions')
           })
           .then((model) => EmberObject.create(model));
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
});
