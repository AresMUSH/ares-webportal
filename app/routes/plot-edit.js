import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        
        return aj.queryOne('plot', { id: params['id'], edit_mode: true  });
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
