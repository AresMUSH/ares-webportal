import $ from "jquery"
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
    gameApi: service(),

    model: function(params) {
      return this.gameApi.requestOne('manageChat');
    }
});
