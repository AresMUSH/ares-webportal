import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import UnauthenticatedRoute from 'ares-webportal/mixins/unauthenticated-route';

export default Route.extend(UnauthenticatedRoute, {
    gameApi: service(),

    model: function() {
      let api = this.gameApi;
      return api.requestOne('loginInfo');
    }
});
