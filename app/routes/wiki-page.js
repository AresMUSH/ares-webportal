import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    flashMessages: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('wikiPage', { id: params['id'] });
    },
    
    afterModel: function(model) {
        if (model.not_found) {
            this.get('flashMessages').warning('That page was not found, but you can create it.');
            this.transitionTo('wiki-create');
        }  
    },
    
    titleToken: function(model) {
        return model.heading;
    }
});
