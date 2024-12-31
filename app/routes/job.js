import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';
import { action } from '@ember/object';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    
    activate: function() {
        this.controllerFor('job').setupCallback();
    },

    @action 
    willTransition(transition) {
      this.gameSocket.removeCallback('job_update');
    },
    
    model: function(params) {
        let api = this.gameApi;

        return RSVP.hash({
             job:  api.requestOne('job', { id: params['id']  }),
             abilities:  api.request('charAbilities', { id: this.get('session.data.authenticated.id') }),
             options: api.requestOne('jobOptions'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => {
             return EmberObject.create(model);
           });
           
    },
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
     
});
