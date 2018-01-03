import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryOne('who');
    },
    
    titleToken: function() {
        return "Who's Online";
    }
    
});
