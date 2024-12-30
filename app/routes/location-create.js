import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.gameApi;

        return RSVP.hash({
             manage:  api.requestOne('manageLocations'),
             characters: api.requestMany('characters', { select: 'include_staff' })
           })
           .then((model) => EmberObject.create(model));
    }
});
