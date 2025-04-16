import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    
    model: function() {
        let api = this.gameApi;
        
        return RSVP.hash({
             options: api.requestOne('jobOptions'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => EmberObject.create(model));
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup(model);
    }
});
