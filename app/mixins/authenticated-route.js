import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
    session: service(),
    flashMessages: service(),
    
    beforeModel: function() {
        if (!this.get('session.isAuthenticated')) {
            this.flashMessages.danger('You must log in first.');
            this.transitionTo('login');
        }
    }
});
