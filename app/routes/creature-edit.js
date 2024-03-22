import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';
import Ember from 'ember';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    model: function(params) {
        let api = this.get('gameApi');

        return RSVP.hash({
           creature:  api.requestOne('creature', { id: params['id'], edit_mode: true  }),
           characters: api.requestMany('characters', { select: 'include_staff' }),
           schools: api.request('getSchools'),
           plots: api.requestMany('plots'),
         })
         .then((model) => Ember.Object.create(model));
    }
});
