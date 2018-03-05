import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webportal/mixins/admin-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(AdminRoute, ReloadableRoute, {
    gameApi: service(),
    titleToken: "Tinker",
    session: service(),
    flashMessages: service(),
    
    beforeModel: function() {
        if (!this.get('session.data.authenticated.is_coder')) {
            this.get('flashMessages').danger('You must be logged in with a coder.');
            this.transitionTo('setup');
        }
    },
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('getTinker');
    },
    
});
