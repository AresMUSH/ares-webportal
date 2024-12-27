import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(DefaultRoute, RouteResetOnExit, {
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('wikiPage', { id: params['id'] });
    },
    
    afterModel: function(model) {
        if (model.not_found) {
          if (this.get('session.isAuthenticated')) {
            this.flashMessages.warning('That page was not found, but you can create it.');
            this.router.transitionTo('wiki-create', { queryParams: { title: model.title || "" }});
          }
          else {
            this.flashMessages.warning('Page not found.');
            this.router.transitionTo('wiki');
          }
        }
    }    
});
