import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    ajax: service(),
    titleToken: "Mail",
        
    model: function() {
        let aj = this.get('ajax');
        return aj.requestOne('mailIndex');
    }
});
