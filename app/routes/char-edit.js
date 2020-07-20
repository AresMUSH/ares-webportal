import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        
        return RSVP.hash({
            char: api.requestOne('profileEdit', { id: params['id'] })
        })
            .then((model) => EmberObject.create(model));
            
    }
});
