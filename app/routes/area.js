import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Route.extend(DefaultRoute, ConfirmAction, {
    gameApi: service(),
    
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('area', { id: params['id'] });
    },
});
