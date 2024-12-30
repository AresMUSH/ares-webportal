import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
            plot: api.requestOne('plot', { id: params['id'] }),
            scenes: api.requestOne('scenes', { plot_id: params['id'], filter: 'All', page: 1 }),
            sceneOptions: api.requestOne('sceneOptions') })
            .then((model) => EmberObject.create(model));
    }
});
