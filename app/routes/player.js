import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    errorRoute: 'players',
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('player', { id: params['id'] });
    },
    
    titleToken: function(model) {
        return model.name;
    }
});
