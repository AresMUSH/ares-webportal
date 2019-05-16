import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    model: function(params) {
        let api = this.get('gameApi');
        let appModel = this.modelFor('application');

        return RSVP.hash({
           characters: api.requestMany('characters', { select: 'include_staff' }),
           schools: api.requestMany('getSchools'),
           creature:  Ember.Object.create({
               sapient: false})
         })
         .then((model) => Ember.Object.create(model));
    }


});
