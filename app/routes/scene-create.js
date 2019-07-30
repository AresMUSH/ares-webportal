import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),

    model: function(params) {
        let api = this.gameApi;
        let appModel = this.modelFor('application');

        return RSVP.hash({
             scene: EmberObject.create({
                 scene_type: 'Social',
                 privacy: 'Private',
                 location: params['location'],
                 icdate: appModel.game.scene_start_date }),
             sceneTypes: api.requestMany('sceneTypes'),
             plots: api.requestMany('plots'),
             characters: api.requestMany('characters', { select: 'include_staff' }),
             locations: api.request('sceneLocations'),
             creatures: api.requestMany('creatures'),
             portals: api.requestMany('portals'),
             scenes: api.requestOne('scenes', { filter: 'Related' })
           })
           .then((model) => EmberObject.create(model));
    }
});
