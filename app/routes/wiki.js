import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
    router: service(),
    
    beforeModel: function() {
        this.router.transitionTo('wiki-page', 'home');
    }
});
