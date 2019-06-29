import Route from '@ember/routing/route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(RestrictedRoute, RouteResetOnExit, {
    model: function() {
        return this.modelFor('application');
    }
});
