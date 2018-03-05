import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
    gameApi: service(),
    routeIfAlreadyAuthenticated: 'home',
    titleToken: 'Register',
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('loginInfo');
    }
});
