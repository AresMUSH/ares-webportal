import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RSVP from 'rsvp';

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
        
        return RSVP.hash({
             chat: api.requestOne('chat'),
             pages: api.requestMany('pageIndex'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => Ember.Object.create(model));
    }
});
