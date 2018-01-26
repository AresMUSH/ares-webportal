import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import JsYaml from "npm:js-yaml";

export default Route.extend(ReloadableRoute, {
    ajax: service(),
    titleToken: function(model) {
        return model.file;  
    },
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('getTextFile', { file_type: params['file_type'], file: params['file']});
    }
});
