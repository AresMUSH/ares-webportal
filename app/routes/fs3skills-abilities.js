import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    titleToken: "Abilities",
    
    model: function() {
        let aj = this.get('ajax');
        return aj.requestOne('abilities');
    }
});
