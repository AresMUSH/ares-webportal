import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    titleToken: function(model) {
        return `Combat ${model.id}`;
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('combat', { id: params['id'] });
    }
});
