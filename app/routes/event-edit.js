import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    session: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('event', {event_id: params['event_id'], edit_mode: true });
    },
    
    titleToken: function(model) {
        return `Edit ${model.title}`;
    }
    
});
