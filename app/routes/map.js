import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    titleToken: function(model) {
        return model.name;
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('map', { id: params['id'] });
    }
});
