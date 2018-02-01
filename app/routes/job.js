import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webportal/mixins/admin-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(AdminRoute, ReloadableRoute, {
    ajax: service(),
    session: service(),
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('job', {id: params['id'] });
    },
    
    titleToken: function(model) {
        return `Job ${model.id}`;
    }
    
});
