import Route from '@ember/routing/route';

export default Route.extend({
    
    queryParams: {
        path: {
          refreshModel: true
        },
        name: {
            refreshModel: true
        }
      },
      
    model: function(params) {
        return Ember.Object.create({ path: params['path'], name: params['name'] });
    },
    titleToken: function(model) {
        return model.name;
    }
});
