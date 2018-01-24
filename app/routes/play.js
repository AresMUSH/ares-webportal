import Route from '@ember/routing/route';

export default Route.extend({
    titleToken: "Web Client",
    
    activate: function() {
        this.controllerFor('application').set('hideSidebar', true);
    },
    deactivate: function() {
        this.controllerFor('application').set('hideSidebar', false);
    }
});
