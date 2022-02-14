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
             sceneOptions: api.requestOne('sceneOptions'),
             plots: api.requestMany('plots'),
             characters: api.requestMany('characters', { select: 'include_staff' }),
             locations: api.request('sceneLocations'),
             scenes: api.requestOne('scenes', { filter: 'Related' })
           })
           .then((model) => EmberObject.create(model));
    },
    
    afterModel: function(model) {
      model.set('scene.scene_type', model.sceneOptions.scene_types[0].name);
      model.set('scene.scene_pacing', model.sceneOptions.scene_pacing[0]);
    }
});
