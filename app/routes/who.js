import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    titleToken: "Who's Online",
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryOne('who');
    }
});
