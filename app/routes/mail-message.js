import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
    titleToken: function(model){
       return `Mail ${model.subject}`;  
    },
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('mailMessage', { id: params['id']});
    }
});
