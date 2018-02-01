import Route from '@ember/routing/route';
import AdminRoute from 'ares-webportal/mixins/admin-route';

export default Route.extend(AdminRoute, {
    titleToken: "Game Management",
    
    model: function() {
        return this.modelFor('application');
    }
});
