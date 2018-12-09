import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.get('gameApi');
                
        return RSVP.hash({
             plot:  api.requestOne('plot', { id: params['id'], edit_mode: true  }),
             characters: api.requestMany('characters')
           })
           .then((model) => Ember.Object.create(model));
    }
});
