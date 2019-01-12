import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    session: service(),

    model: function() {
      let api = this.get('gameApi');
      return RSVP.hash({
           jobs:  api.requestMany('jobs'),
           options: api.requestOne('jobOptions')
         })
         .then((model) => {
           return Ember.Object.create(model);
         });
    }  
});
