import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';

export default Route.extend(RouteTransitionOnError, AuthenticatedRoute, ReloadableRoute, {
    ajax: service(),
    titleToken: 'Character Creation',

    model: function(params) {
        let aj = this.get('ajax');
        
        return RSVP.hash({
            char: aj.queryOne('chargenChar', { id: this.get('session.data.authenticated.id') }),
            cgInfo: aj.queryOne('chargenInfo', {})})
            .then((model) => Ember.Object.create(model));
    }
});
