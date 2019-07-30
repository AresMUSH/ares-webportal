import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, RouteResetOnExit, {
    gameApi: service(),
    
    model: function() {
        let api = this.gameApi;
        return RSVP.hash({
             scenes:  api.requestOne('scenes', { filter: 'Recent', page: 1 }),
             sceneTypes: api.requestMany('sceneTypes')
           })
           .then((model) => EmberObject.create(model));
           
    }
});
