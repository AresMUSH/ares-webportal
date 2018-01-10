import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import RSVP from 'rsvp';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    errorRoute: 'scenes',
        
    model: function(params) {
        let aj = this.get('ajax');
        
        return RSVP.hash({
             scene:  aj.queryOne('scene', { id: params['id'], edit_mode: true  }),
             sceneTypes: aj.queryMany('sceneTypes', {}),
             plots: aj.queryMany('plots', {}),
             characters: aj.queryMany('characters', {}),
             scenes: aj.queryMany('scenes', {})
           })
           .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
