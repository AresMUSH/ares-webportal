import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    ajax: service(),
    titleToken: function(model) {
        return `Combatant ${model.name}`;
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('combatant', { id: params['id'] });
    }
});
