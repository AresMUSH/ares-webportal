import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webclient/mixins/default-route';
import { inject as service } from '@ember/service';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    titleToken: 'Actors',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryMany('actors');
    }
});
