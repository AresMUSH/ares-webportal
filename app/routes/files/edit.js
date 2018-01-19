import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    
    queryParams: {
        path: {
          refreshModel: true
        },
        name: {
            refreshModel: true
        }
      },
      
    model: function(params) {
        let split = (params['path'] || "").split('/');
        let folder = split.length > 2 ? split[1] : ''
        
        return Ember.Object.create({ path: params['path'], name: params['name'], folder: folder });
    },
    titleToken: function(model) {
        return 'Edit ' + model.name;
    }
});
