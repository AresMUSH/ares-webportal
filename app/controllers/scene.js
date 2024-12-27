import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  router: service(),
  flashMessages: service(),
    
  pageTitle: computed('model.{icdate,title}', function () {
    return `${this.get('model.icdate')} - ${this.get('model.title')}`;
  }),

  @action
  like(like) {
    let api = this.gameApi;
    api.requestOne('likeScene', { id: this.get('model.id'), like: like})
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
    });
  },
        
  @action
  unshareScene() {
    let api = this.gameApi;
    api.requestOne('changeSceneStatus', { id: this.get('model.id'),
    status: 'unshare' }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('The scene is no longer shared.');
      this.router.transitionTo('scene-live', this.get('model.id'));
    });
  },
});