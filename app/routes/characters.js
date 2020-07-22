import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    headData: service(),
    
    model: function() {
        let api = this.gameApi;
        return RSVP.hash({
            characters: api.requestOne('characterGroups'),
            game: this.modelFor('application').game})
            .then((model) => EmberObject.create(model));
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
