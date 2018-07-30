import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    confirmDelete: false,
    
    pageTitle: function() {
        return `${this.get('model.icdate')} - ${this.get('model.title')}`
    }.property(),
    
    actions: {
        like(like) {
            let api = this.get('gameApi');
            api.requestOne('likeScene', { id: this.get('model.id'), like: like})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        },
        
        delete() {
            let api = this.get('gameApi');
            this.set('confirmDelete', false);
            api.requestOne('deleteScene', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('scenes');
                this.get('flashMessages').success('Scene deleted!');
            });
        },
        
        unshareScene() {
            let api = this.get('gameApi');
            api.requestOne('changeSceneStatus', { id: this.get('model.id'),
                status: 'unshare' }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('The scene is no longer shared.');
                this.transitionToRoute('scene-live', this.get('model.id'));
            });
        },
    }
});