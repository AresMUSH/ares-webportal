import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';
import RouteResetFormOnExit from 'ares-webclient/mixins/route-reset-form-on-exit';

export default Route.extend(RouteResetFormOnExit, AuthenticatedRoute, {
    titleToken: "Create Event",
    
    model: function() {
        return this.modelFor('application');
    }
});
