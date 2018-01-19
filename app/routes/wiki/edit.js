import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(RouteTransitionOnError, AuthenticatedRoute, {
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('wikiPage', { id: params['id'], edit_mode: true });
    },
    
    titleToken: function() {
        return this.get('model.heading');
    }
});
