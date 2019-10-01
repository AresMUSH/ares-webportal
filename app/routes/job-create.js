import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, RouteResetOnExit, {
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
      controller.setCategory(model.get('options.request_category'));
      controller.set('submitter', model.get('characters').find(c => c.id == this.get('session.data.authenticated.id')));
    }
});
