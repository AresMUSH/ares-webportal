import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
        
    model: function() {
        let api = this.gameApi;
        return api.requestMany('characters', { select: 'include_staff' });
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.set('storyteller', model.find(c => c.id == this.get('session.data.authenticated.id')));
    }
});
