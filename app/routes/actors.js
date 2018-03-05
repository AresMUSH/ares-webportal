import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import { inject as service } from '@ember/service';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    titleToken: 'Actors',
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestMany('actors');
    }
});
