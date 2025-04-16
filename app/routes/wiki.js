import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    router: service(),
    
    beforeModel: function() {
        this.router.transitionTo('wiki-page', 'home');
    }
});
