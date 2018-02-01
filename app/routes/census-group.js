import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    session: service(),
    titleToken: function(model) {
        return `${model.filter} Census`;
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash({
             filter: params['filter'],
             types:  aj.request('censusTypes'),
             census: aj.requestOne('censusGroup', {filter: params['filter']}),
           })
           .then((model) => Ember.Object.create(model));
    }
});
