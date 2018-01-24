import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
    ajax: service(),
    routeIfAlreadyAuthenticated: 'home',
    titleToken: "Login",
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryOne('loginInfo');
    }
});
