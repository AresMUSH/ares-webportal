import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(ReloadableRoute, RouteResetOnExit, DefaultRoute, {
    gameApi: service(),
    session: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('forumTopic', { topic_id: params['topic_id'] });
    },
    titleToken: function(model) {
        return `${model.title} - ${model.category.name}`;
    }
    
});
