import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(RouteResetOnExit, AuthenticatedRoute, {
    gameApi: service(),
    session: service(),
    titleToken: "New Post",

    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('forumCategory', {category_id: params['category_id']});
    }
});
