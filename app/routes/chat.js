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
    updateTimerId: null,
    
    activate: function() {
      let controller = this.controllerFor('chat');
        controller.setupCallback();
        let timer = window.setInterval(controller.updateTimestamps.bind(controller), 1000*15); // Update each five mins
        this.set('updateTimerId', timer);
        
    },
    
    deactivate: function() {
        this.gameSocket.removeCallback('new_chat');
        this.gameSocket.removeCallback('new_page');
        window.clearInterval(this.updateTimerId);
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
