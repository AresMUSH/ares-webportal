import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteResetFormOnExit from 'ares-webclient/mixins/route-reset-form-on-exit';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(RouteResetFormOnExit, AuthenticatedRoute, {
    ajax: service(),
    session: service(),
    titleToken: "New Post",

    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('forumCategory', {category_id: params['category_id']});
    }
});
