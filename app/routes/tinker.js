import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(RestrictedRoute, ReloadableRoute, {
    gameApi: service(),
    session: service(),
    flashMessages: service(),
    
    allowedErorrMessage: 'You must be logged in as a coder.',

    isAllowed: function() {
        return this.get('session.data.authenticated.is_coder');
    },
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('getTinker');
    },
    
});
