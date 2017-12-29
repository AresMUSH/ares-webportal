import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

    ajax: service(),

    model: function() {
        let aj = this.get('ajax');
        return aj.queryOne('game', {});
    },

    title: function(tokens) {
        let mush_name = aresconfig.mu_name;
        if (tokens.length > 0) {
            return tokens.reverse().join(' - ') + " - " + mush_name;
        }
        else {
            return mush_name;
        }
    }
 });
