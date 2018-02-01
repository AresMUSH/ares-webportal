import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    ajax: service(),
    titleToken: 'Character Creation',

    model: function() {
        let aj = this.get('ajax');
        
        return RSVP.hash({
            char: aj.requestOne('chargenChar'),
            cgInfo: aj.requestOne('chargenInfo')})
            .then((model) => Ember.Object.create(model));
    }
});
