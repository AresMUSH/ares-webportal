import Route from '@ember/routing/route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(RouteResetOnExit, AuthenticatedRoute, {
  gameApi: service(),
      
  model: function() {
      let api = this.get('gameApi');
      return api.requestMany('characters', { select: 'all' });
  }
  
});
