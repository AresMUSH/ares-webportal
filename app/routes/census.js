import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    
    model: function() {
        let api = this.get('gameApi');
        return RSVP.hash({
             types:  api.request('censusTypes'),
             census: api.requestOne('censusFull'),
           })
           .then((model) => Ember.Object.create(model));
    }
});
