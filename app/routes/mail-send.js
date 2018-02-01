import Route from '@ember/routing/route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(RouteResetOnExit, AuthenticatedRoute, {
    titleToken: "Compose Mail"
});
