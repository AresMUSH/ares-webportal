import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(ReloadableRoute, DefaultRoute, {
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('scene', { id: params['id'] });
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
