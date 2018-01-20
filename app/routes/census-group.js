import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    session: service(),
    titleToken: 'Census',
    
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash({
             filter: params['filter'],
             types:  aj.query('censusTypes'),
             census: aj.queryOne('censusGroup', {filter: params['filter']}),
           })
           .then((model) => Ember.Object.create(model));
    }
});
