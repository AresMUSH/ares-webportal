import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(RouteTransitionOnError, ReloadableRoute, {
    ajax: service(),
    routeToGoToOnError: 'scenes',
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('scene', { id: params['id'] });
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
