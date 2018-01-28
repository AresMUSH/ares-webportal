import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webclient/mixins/admin-route';

export default Route.extend(AdminRoute, {
    ajax: service(),
    session: service(),
    titleToken: 'Jobs',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.requestMany('jobs');
    },
    
    
});
