import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default Route.extend({
    activate: function() {
        this.controllerFor('application').set('hideSidebar', true);
    },

    @action 
    willTransition(transition) {
        this.controllerFor('application').set('hideSidebar', false);
        this.controllerFor('client').send('disconnect');
    }
});
