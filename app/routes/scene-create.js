import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
    titleToken: 'Create Scene',
        
    model: function() {
        let aj = this.get('ajax');
        
        return RSVP.hash({
             scene: Ember.Object.create(),
             sceneTypes: aj.requestMany('sceneTypes'),
             plots: aj.requestMany('plots'),
             characters: aj.requestMany('characters'),
             scenes: aj.requestMany('scenes')
           })
           .then((model) => Ember.Object.create(model));
    }
});
