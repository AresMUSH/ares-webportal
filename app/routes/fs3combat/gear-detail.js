import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    routeToGoToOnError: 'fs3combat.gear',
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('gearDetail', {type: params['type'], name: params['name']});
    },
    
    titleToken: function(model) {
        return model.name;
    }
    
});
