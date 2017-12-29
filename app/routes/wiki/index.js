import Route from '@ember/routing/route';

export default Route.extend({
    
    beforeModel: function(params) {
        this.transitionTo('wiki.page', 'home');
    }
});
