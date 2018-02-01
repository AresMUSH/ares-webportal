import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    titleToken: 'Recent Changes',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.requestMany('recentChanges');
    }
});
