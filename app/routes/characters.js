import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    titleToken: 'Characters',
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
            characters: aj.requestOne('characterGroups'),
            game: this.modelFor('application').game})
            .then((model) => Ember.Object.create(model));
    }
});
