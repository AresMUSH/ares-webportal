import Route from '@ember/routing/route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';

export default Route.extend(RestrictedRoute, {
    model: function() {
        return this.modelFor('application');
    }
});
