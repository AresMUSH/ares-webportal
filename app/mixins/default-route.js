import Mixin from '@ember/object/mixin';
import BaseRoute from 'ares-webportal/mixins/base-route';
import { inject as service } from '@ember/service';

export default Mixin.create(BaseRoute, {
    session: service(),
    flashMessages: service(),
    router: service(),
    
    beforeModel: function() {
        let appModel = this.modelFor('application');
        if (appModel.game_down) {
            return;
        }
        let regRequired = appModel.get('registration_required');
        
        if (regRequired && !this.get('session.isAuthenticated')) {
            this.flashMessages.danger('You must log in first.');
            this.router.transitionTo('login');
        }
    }
});
