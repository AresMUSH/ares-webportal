import Mixin from '@ember/object/mixin';
import BaseRoute from 'ares-webportal/mixins/base-route';
import { inject as service } from '@ember/service';

export default Mixin.create(BaseRoute, {
    session: service(),
    router: service(),
    flashMessages: service(),
    
    beforeModel: function() {
        if (this.get('session.isAuthenticated')) {
            this.flashMessages.danger('You must log out first.');
            this.router.transitionTo('home');
        }
    }
});
