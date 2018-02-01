import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    session: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('event', {event_id: params['event_id']});
    },
    
    titleToken: function(model) {
        return model.title;
    }
    
});
