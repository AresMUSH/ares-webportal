import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    titleToken: 'Characters',
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
            characters: aj.queryOne('characterGroups'),
            game: this.modelFor('application').game})
            .then((model) => Ember.Object.create(model));
    }
});
