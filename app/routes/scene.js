import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(ReloadableRoute, {
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.queryOne('scene', { id: params['id'] });
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
