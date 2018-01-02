import Route from '@ember/routing/route';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';
import { inject as service } from '@ember/service';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    session: service(),
    titleToken: 'Forums',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryMany('forumList', {});
    }
});
