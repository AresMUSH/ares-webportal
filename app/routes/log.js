import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webportal/mixins/admin-route';

export default Route.extend(AdminRoute, {
    ajax: service(),
    session: service(),
    titleToken: function(model) {
        return model.name;
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('log', { file: params['file']});
    },
    
    
});
