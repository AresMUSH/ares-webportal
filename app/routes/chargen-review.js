import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
    titleToken: 'Character Review',

    model: function() {
        let aj = this.get('ajax');
        return aj.queryOne('chargenReview', {}, 'chargen');
    }
});
