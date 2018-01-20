import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('forumCategory', {category_id: params['category_id']});
    },
    
    titleToken: function(model) {
        return model.name;
    }
    
});
