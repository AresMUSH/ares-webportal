import Route from '@ember/routing/route';
import RouteResetFormOnExit from 'ares-webclient/mixins/route-reset-form-on-exit';

export default Route.extend(RouteResetFormOnExit, {
    titleToken: function() {
        return "Create Plot";
    }    
});
