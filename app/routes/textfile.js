import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import AdminRoute from 'ares-webclient/mixins/admin-route';

export default Route.extend(ReloadableRoute, AdminRoute, {
    ajax: service(),
    titleToken: function(model) {
        return model.file;  
    },
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('getTextFile', { file_type: params['file_type'], file: params['file']});
    }
});
