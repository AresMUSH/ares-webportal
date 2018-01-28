import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AdminRoute from 'ares-webclient/mixins/admin-route';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(AdminRoute, ReloadableRoute, {
    ajax: service(),
    titleToken: "Tinker",
        
    model: function() {
        let aj = this.get('ajax');
        return aj.requestOne('getTinker');
    },
    
});
