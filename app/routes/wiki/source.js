import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('wikiPageSource', { page_id: params['page_id'], version_id: params['version_id'] });
    },
    
    titleToken: function() {
        return this.get('model.heading');
    }
});
