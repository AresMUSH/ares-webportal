import $ from "jquery"
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),

    model: function(params) {
      return this.gameApi.requestOne('manageForum');
    }
});
