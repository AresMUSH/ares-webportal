import Route from '@ember/routing/route';

export default Route.extend({
    model: function(params) {
        return Ember.Object.create({ id: params['id'] });
    },
    titleToken: function(model) {
        return model.name;
    }
});
