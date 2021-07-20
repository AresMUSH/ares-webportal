import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    session: service(),

    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
            schools: api.request('getSchools'),
            portals: api.request('portal')
           })
           .then((model) => EmberObject.create(model));
    }
});
