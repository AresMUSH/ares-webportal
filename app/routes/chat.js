import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    ajax: service(),
    titleToken: 'Chat',
    
    activate: function() {
        this.controllerFor('chat').setupCallback();
    },
    
    model: function() {
        let aj = this.get('ajax');
        return aj.request('chat');
    }
});
