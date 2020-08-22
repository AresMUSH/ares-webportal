import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    gameApi: service(),

    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
            char: api.requestOne('chargenChar', { id: params['char_id'] }),
            cgInfo: api.requestOne('chargenInfo'),
            app: this.modelFor('application', { id: params['char_id'] }) 
            })
            .then((model) => EmberObject.create(model));
    }
});
