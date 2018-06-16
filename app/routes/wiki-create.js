import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    
    model: function(params) {
        return Ember.Object.create({ title: params['title'] });
    }
});
