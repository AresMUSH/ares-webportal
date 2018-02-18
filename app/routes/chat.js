import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    ajax: service(),
    notifications: service(),
    titleToken: 'Chat',
    
    activate: function() {
        this.controllerFor('chat').setupCallback();
    },
    
    deactivate: function() {
        this.set('notifications.chatCallback', null);
    },
    
    model: function() {
        let aj = this.get('ajax');
        return aj.request('chat');
    }
});
