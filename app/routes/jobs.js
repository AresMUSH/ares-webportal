import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
  
    activate: function() {
        this.controllerFor('jobs').setupCallback();
    },
  
    deactivate: function() {
      this.gameSocket.removeCallback('job_update');
    },
    
    model: function() {
      let api = this.gameApi;
      return RSVP.hash({
           jobs:  api.requestOne('jobs', { page: 1 }),
           options: api.requestOne('jobOptions')
         })
         .then((model) => {
           return EmberObject.create(model);
         });
    }  
});
