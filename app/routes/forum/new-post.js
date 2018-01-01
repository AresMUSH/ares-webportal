import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    session: service(),
    routeToGoToOnError: 'forum',
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('forumCategory', {category_id: params['category_id'], char_id: this.get('session.data.authenticated.name')});
    },
    
    titleToken: function(model) {
        return model.name;
    }
    
});
