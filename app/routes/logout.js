import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    session: service(),
    flashMessages: service(),
    
    beforeModel: function() {
        this.session.invalidate();
        this.transitionToRoute('home');
    }
});
