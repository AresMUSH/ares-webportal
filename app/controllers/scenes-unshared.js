import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  flashMessages: service(),
  router: service(),
    
  @action
  changeSceneStatus(scene, status) {
    let sceneId = scene.id;
    if (status === 'share' && !scene.can_share) {
      window.scrollTo(0, 50);
      this.flashMessages.danger("You can't share the scene until all the scene details are set.");
      return;
    }
    let api = this.gameApi;
    api.requestOne('changeSceneStatus', 
    {
      id: sceneId,
      status: status
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      if (status === 'share') {
        this.flashMessages.success('The scene has been shared.');
        this.router.transitionTo('scene', sceneId); 
      }
      else if (status === 'restart') {
        this.flashMessages.success('The scene has been restarted.');
        this.router.transitionTo('scene-live', sceneId); 
      }
    });
  }, 
});