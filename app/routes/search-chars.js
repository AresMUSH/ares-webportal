import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(DefaultRoute, ReloadableRoute, RouteResetOnExit, {
  gameApi: service(),
    
  model: function() {
    let api = this.gameApi;
    return RSVP.hash({
        cgInfo: api.requestOne('chargenInfo')
    })
    .then((model) => EmberObject.create(model));
         
  }
});
