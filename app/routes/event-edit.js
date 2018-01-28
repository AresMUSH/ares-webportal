import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
    session: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('event', {event_id: params['event_id'], edit_mode: true });
    },
    
    titleToken: function(model) {
        return `Edit ${model.title}`;
    }
    
});
