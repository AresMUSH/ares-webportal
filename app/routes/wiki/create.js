import Route from '@ember/routing/route';

export default Route.extend({
    model: function() {
        return Ember.Object.create();
    },
    
    titleToken: function() {
        return "Create Wiki Page";
    }
});
