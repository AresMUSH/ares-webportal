import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('blankWiki', 
        { title: params['title'], 
          category: params['category'], 
          template: params['template'],
          tags: params['tags'] 
       });
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup(model);
    }
});
