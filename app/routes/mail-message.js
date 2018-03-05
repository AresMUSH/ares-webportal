import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
    titleToken: function(model){
       return `Mail ${model.subject}`;  
    },
        
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('mailMessage', { id: params['id']});
    }
});
