import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    router: service(),
    flashMessages: service(),
    confirmDelete: false,
    
    pageTitle: computed('model.{icdate,title}', function () {
      return `${this.get('model.icdate')} - ${this.get('model.title')}`;
    }),

    
    resetOnExit: function() {
      this.set('confirmDelete', false);
    },
    
    actions: {
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
    }
});