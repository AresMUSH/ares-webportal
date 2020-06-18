import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    flashMessages: service(),
    headData: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('wikiPage', { id: params['id'] });
    },
    
    afterModel: function(model) {
        if (model.not_found) {
          if (this.get('session.isAuthenticated')) {
            this.flashMessages.warning('That page was not found, but you can create it.');
            this.transitionTo('wiki-create', { queryParams: { title: model.title || "" }});
          }
          else {
            this.flashMessages.warning('Page not found.');
            this.transitionTo('wiki');
          }
        }
        this.set('headData.robotindex', true);
    }    
});
