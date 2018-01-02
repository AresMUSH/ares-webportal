import Route from '@ember/routing/route';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    
    beforeModel: function() {
        this.transitionTo('wiki.page', 'home');
    }
});
