import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
        
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('profileSource', { char_id: params['charId'], version_id: params['versionId'] });
    },
    
    titleToken: function(model) {
        return `${model.char_name} Source`;
    }
});
