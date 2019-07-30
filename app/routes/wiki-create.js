import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    
    model: function(params) {
        return EmberObject.create({ title: params['title'] });
    }
});
