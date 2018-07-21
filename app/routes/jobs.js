import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    session: service(),

    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('jobs');
    },
});
