import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import AdminRoute from 'ares-webclient/mixins/admin-route';
import JsYaml from "npm:js-yaml";

export default Route.extend(ReloadableRoute, AdminRoute, {
    ajax: service(),
    titleToken: function(model) {
        return model.file;  
    },
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('getConfig', { file: params['file']})
        .then(model => {
            Object.keys(model.config).forEach(function(k) {
                model.config[k].new_value = JsYaml.dump(model.config[k].value);
            });
            return model;
        })
       
    }
});
