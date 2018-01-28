import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    titleToken: 'Census',
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
             types:  aj.request('censusTypes'),
             census: aj.requestOne('censusFull'),
           })
           .then((model) => Ember.Object.create(model));
    }
});
