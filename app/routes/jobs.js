import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';
import { action } from '@ember/object';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
  
    activate: function() {
        this.controllerFor('jobs').setupCallback();
    },
  
    @action 
    willTransition(transition) {
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
