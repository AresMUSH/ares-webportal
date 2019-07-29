import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
    session: service(),
    flashMessages: service(),
    
    beforeModel: function() {
        let appModel = this.modelFor('application');
        if (appModel.game_down) {
            return;
        }
        let regRequired = appModel.get('registration_required');
        
        if (regRequired && !this.get('session.isAuthenticated')) {
            this.flashMessages.danger('You must log in first.');
            this.transitionTo('login');
        }
    }
});
