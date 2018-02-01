import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(ReloadableRoute, DefaultRoute, {
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('scene', { id: params['id'] })
            .then(response => { 
                if (response.unshared) {
                    this.transitionTo('scene-live', params['id']);
                } 
                return response;
            });
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
