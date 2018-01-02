import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, UnauthenticatedRouteMixin, {
    ajax: service(),
    routeIfAlreadyAuthenticated: 'home',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryOne('loginInfo', {});
    },
    
    titleToken: function() {
        return "Register";
    }
});
