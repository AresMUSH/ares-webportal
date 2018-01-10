import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    session: service(),
    errorRoute: 'events',
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('event', {event_id: params['event_id'], edit_mode: true });
    },
    
    titleToken: function(model) {
        return model.title;
    }
    
});
