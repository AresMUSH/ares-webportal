import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AdminRoute from 'ares-webportal/mixins/admin-route';

export default Route.extend(ReloadableRoute, AdminRoute, {
    ajax: service(),
    titleToken: function(model) {
        return model.file;  
    },
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('getTextFile', { file_type: params['file_type'], file: params['file']});
    }
});
