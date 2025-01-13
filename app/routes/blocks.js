import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  gameApi: service(),

  model: function(params) {
      let api = this.gameApi;
      return RSVP.hash({
          blockInfo: api.requestOne('blockList'),
          chars: api.requestMany('characters')
      }).then((model) => EmberObject.create(model));
  }
});
