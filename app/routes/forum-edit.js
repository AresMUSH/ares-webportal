import $ from "jquery"
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, {
    gameApi: service(),

    model: function(params) {
      return this.gameApi.requestOne('editForum', { id: params['id'] });
    }
});
