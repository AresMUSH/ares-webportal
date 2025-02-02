import Route from '@ember/routing/route';
import { action } from '@ember/object';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    activate: function() {
        this.controllerFor('application').set('hideSidebar', true);
    },

    @action 
    willTransition(transition) {
        this.controllerFor('application').set('hideSidebar', false);
        this.controllerFor('client').send('disconnect');
    }
});
