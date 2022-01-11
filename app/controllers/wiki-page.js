import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    router: service(),
    confirmDelete: false,
    
    actions: {
        delete() {
            let api = this.gameApi;
            this.set('confirmDelete', false);
            api.requestOne('deleteWiki', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.router.transitionTo('wiki');
                this.flashMessages.success('Page deleted!');
            });
        }
    }
});