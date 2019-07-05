import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.get('gameApi');
        let appModel = this.modelFor('application');
        
        return RSVP.hash({
             scene: Ember.Object.create({ 
                 scene_type: 'Social',
                 privacy: 'Private',
                 location: params['location'],
                 icdate: appModel.game.scene_start_date }),
             sceneTypes: api.requestMany('sceneTypes'),
             plots: api.requestMany('plots'),
             characters: api.requestMany('characters', { select: 'include_staff' }),
             locations: api.request('sceneLocations'),
             scenes: api.requestOne('scenes', { filter: 'Related' })
           })
           .then((model) => Ember.Object.create(model));
    }
});
