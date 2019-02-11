import Route from '@ember/routing/route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRoute, RouteResetOnExit, {
    gameApi: service(),
        
    model: function() {
        let api = this.get('gameApi');
        return api.requestMany('characters', { select: 'include_staff' });
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.set('storyteller', model.find(c => c.id == this.get('session.data.authenticated.id')));
    }
});
