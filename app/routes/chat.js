import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    gameApi: service(),
    gameSocket: service(),
    
    activate: function() {
        this.controllerFor('chat').setupCallback();
    },
    
    deactivate: function() {
        this.set('gameSocket.chatCallback', null);
    },
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('chat');
    }
});
