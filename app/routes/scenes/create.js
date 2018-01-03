import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import RSVP from 'rsvp';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    routeToGoToOnError: 'scenes',
        
    model: function() {
        let aj = this.get('ajax');
        
        return RSVP.hash({
             scene: Ember.Object.create(),
             scene_types: aj.queryMany('sceneTypes', {}),
             plots: aj.queryMany('plots', {}),
             characters: aj.queryMany('characters', {}),
             scenes: aj.queryMany('scenes', {})
           });
    },
    
    titleToken: function() {
        return "Create Scene";
    }
});
