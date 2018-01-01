import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(RouteTransitionOnError, ReloadableRoute, {
    ajax: service(),
    session: service(),
    routeToGoToOnError: 'forum',
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('forumTopic', { topic_id: params['topic_id'] });
    },
    titleToken: function(model) {
        return `${model.title} - ${model.category.name}`;
    }
    
});
