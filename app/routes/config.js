import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RestrictedRoute from 'ares-webportal/mixins/restricted-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import JsYaml from "js-yaml";

export default Route.extend(ReloadableRoute, RouteResetOnExit, RestrictedRoute, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('getConfig', { file: params['file']})
        .then(model => {
          
          if (model.get('valid')) {
            Object.keys(model.config).forEach(function(k) {
                model.config[k].new_value = JsYaml.dump(model.config[k].value);
            });
            return model;
          }
          else {
            this.flashMessages.danger('There is a problem with this config file.  Check your formatting.');
            this.transitionTo('textfile', 'config', model.get('file'));
          }
        });
       
    }
});
