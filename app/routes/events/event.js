import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    session: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('event', {event_id: params['event_id']});
    },
    
    titleToken: function(model) {
        return model.title;
    }
    
});
