import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(RestrictedRoute, ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
             characters: api.requestMany('characters', { select: 'all' }),
             banned: api.requestMany('banList')
           })
           .then((model) => EmberObject.create(model));
    }
});
