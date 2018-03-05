import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    titleToken: 'Characters',
    
    model: function() {
        let api = this.get('gameApi');
        return RSVP.hash({
            characters: api.requestOne('characterGroups'),
            game: this.modelFor('application').game})
            .then((model) => Ember.Object.create(model));
    }
});
