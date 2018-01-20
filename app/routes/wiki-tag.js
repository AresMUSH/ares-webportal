import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash(
            { 
                name: params['id'], 
                content: aj.queryOne('wikiTag', { id: params['id'] })
            })
            .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function() {
        return this.get('model.name');
    }
});
