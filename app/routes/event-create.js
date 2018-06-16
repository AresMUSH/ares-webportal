import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(RouteResetOnExit, AuthenticatedRoute, {    
    model: function() {
        return this.modelFor('application');
    }
});
