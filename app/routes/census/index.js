import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    session: service(),
    titleToken: 'Census',
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
             types:  aj.query('censusTypes', {}),
             census: aj.queryOne('censusFull', {}),
           });
    }
});
