import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
    session: service(),
    router: service(),
    flashMessages: service(),
    allowedErrorMessage: 'You must be logged in as an admin or coder.',

    isAllowed: function() {
        return this.get('session.data.authenticated.is_admin') || 
               this.get('session.data.authenticated.is_coder');
    },
    
    beforeModel: function() {
        if (!this.isAllowed()) {
            this.flashMessages.danger(this.allowedErrorMessage);
            this.router.transitionTo('login');
        }
    }
});
