import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
    session: service(),
    flashMessages: service(),
    
    beforeModel: function() {
        if (!this.get('session.data.authenticated.is_admin')) {
            this.get('flashMessages').danger('You must be logged in as an admin.');
            this.transitionTo('login');
        }
    }
});
