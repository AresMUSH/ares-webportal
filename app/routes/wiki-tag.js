import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return RSVP.hash(
            { 
                name: params['id'], 
                content: api.requestOne('wikiTag', { id: params['id'] })
            })
            .then((model) => Ember.Object.create(model));
    }
});
