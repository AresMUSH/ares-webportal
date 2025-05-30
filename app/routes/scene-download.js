import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    textFile: null,
  
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('downloadScene', { id: params['id'] });
      }
});
