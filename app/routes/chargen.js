import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    gameApi: service(),

    model: function() {
        let api = this.gameApi;
        
        return RSVP.hash({
            char: api.requestOne('chargenChar'),
            cgInfo: api.requestOne('chargenInfo'),
            app: this.modelFor('application') 
            })
            .then((model) => EmberObject.create(model));
    }
});
