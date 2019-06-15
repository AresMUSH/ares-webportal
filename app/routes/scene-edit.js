import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),

    model: function(params) {
        let api = this.get('gameApi');

        return RSVP.hash({
             scene:  api.requestOne('scene', { id: params['id'], edit_mode: true  }),
             sceneTypes: api.requestMany('sceneTypes'),
             plots: api.requestMany('plots'),
             characters: api.requestMany('characters', { select: 'include_staff' }),
             creatures: api.requestMany('creatures'),
             portals: api.requestMany('portals'),
             scenes: api.requestOne('scenes')
           })
           .then((model) => Ember.Object.create(model));
    }
});
