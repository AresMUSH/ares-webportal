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
        this.controllerFor('chat').setupCallback();
    },
    
    deactivate: function() {
        this.set('gameSocket.chatCallback', null);
    },
    
    model: function() {
        let api = this.get('gameApi');
        
        return RSVP.hash({
             chat: api.requestMany('chat'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => Ember.Object.create(model));
    }
});
