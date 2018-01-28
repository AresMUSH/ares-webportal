import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import RouteResetFormOnExit from 'ares-webclient/mixins/route-reset-form-on-exit';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(ReloadableRoute, RouteResetFormOnExit, DefaultRoute, {
    ajax: service(),
    session: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('forumTopic', { topic_id: params['topic_id'] });
    },
    titleToken: function(model) {
        return `${model.title} - ${model.category.name}`;
    }
    
});
