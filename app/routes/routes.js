import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import AvailableRoutes from 'ares-webportal/mixins/available-routes';

export default Route.extend(DefaultRoute, AvailableRoutes, {
  model: function() {
    return this.availableRoutes();
    }
});
