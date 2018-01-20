import Route from '@ember/routing/route';
import RouteResetFormOnExit from 'ares-webclient/mixins/route-reset-form-on-exit';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(RouteResetFormOnExit, AuthenticatedRoute, {
    titleToken: function() {
        return "Create Plot";
    }    
});
