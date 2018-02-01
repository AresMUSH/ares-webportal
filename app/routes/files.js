import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(ReloadableRoute, DefaultRoute, {
    ajax: service(),
    titleToken: 'Files',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.requestMany('files');
    }
});
