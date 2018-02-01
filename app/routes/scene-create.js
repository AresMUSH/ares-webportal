import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
    titleToken: 'Create Scene',
        
    model: function() {
        let aj = this.get('ajax');
        let appModel = this.modelFor('application');
        
        return RSVP.hash({
             scene: Ember.Object.create({ 
                 scene_type: 'Social',
                 privacy: 'Private',
                 icdate: appModel.game.scene_start_date }),
             sceneTypes: aj.requestMany('sceneTypes'),
             plots: aj.requestMany('plots'),
             characters: aj.requestMany('characters'),
             scenes: aj.requestMany('scenes')
           })
           .then((model) => Ember.Object.create(model));
    }
});
