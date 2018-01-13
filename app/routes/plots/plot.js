import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(RouteTransitionOnError, ReloadableRoute, {
    ajax: service(),
    errorRoute: 'plots',
        
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash({
            plot: aj.queryOne('plot', { id: params['id'] }),
            sceneTypes: aj.queryMany('sceneTypes', {}) })
            .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
