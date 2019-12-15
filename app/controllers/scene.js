import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    confirmDelete: false,
    
    pageTitle: computed(function() {
        return `${this.get('model.icdate')} - ${this.get('model.title')}`
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
        
        delete() {
            let api = this.gameApi;
            this.set('confirmDelete', false);
            api.requestOne('deleteScene', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('scenes');
                this.flashMessages.success('Scene deleted!');
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
                this.transitionToRoute('scene-live', this.get('model.id'));
            });
        },
    }
});