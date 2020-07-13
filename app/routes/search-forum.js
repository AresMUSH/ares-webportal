import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, RouteResetOnExit, {
  model: function() {
      return this.modelFor('application');
  }
});
