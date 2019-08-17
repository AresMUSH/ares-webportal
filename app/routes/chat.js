import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
    
    activate: function() {
      let controller = this.controllerFor('chat');
      controller.setupCallback();        
    },
    
    deactivate: function() {
        this.gameSocket.removeCallback('new_chat');
        this.gameSocket.removeCallback('new_page');
    },
    
    model: function() {
        let api = this.gameApi;
        
        return RSVP.hash({
             chat: api.requestMany('chat'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => EmberObject.create(model));
    }
});
