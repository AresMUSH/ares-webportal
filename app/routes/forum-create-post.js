import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    session: service(),

    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('forumCategory', {category_id: params['category_id']});
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
});
