import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    
    actions: {
      
        changeSceneStatus(sceneId, status) {
            let api = this.gameApi;
            api.requestOne('changeSceneStatus', { id: sceneId,
                status: status }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (status === 'share') {
                    this.flashMessages.success('The scene has been shared.');
                    this.transitionToRoute('scene', sceneId); 
                }
                else if (status === 'restart') {
                    this.flashMessages.success('The scene has been restarted.');
                    this.transitionToRoute('scene-live', sceneId); 
                }
            });
        },
        
        
    }
});