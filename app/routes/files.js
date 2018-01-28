import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(ReloadableRoute, DefaultRoute, {
    ajax: service(),
    titleToken: 'Files',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryMany('files');
    }
});
