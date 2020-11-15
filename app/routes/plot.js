import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(ReloadableRoute, RouteResetOnExit, DefaultRoute, {
    gameApi: service(),
    headData: service(),
        
    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
            plot: api.requestOne('plot', { id: params['id'] }),
            scenes: api.requestOne('scenes', { plot_id: params['id'], filter: 'All', page: 1 }),
            sceneOptions: api.requestOne('sceneOptions') })
            .then((model) => EmberObject.create(model));
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
