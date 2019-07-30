import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    confirmDelete: false,

    resetOnExit: function() {
      this.set('confirmDelete', false);
    },
    
    actions: {
        delete() {
            let api = this.gameApi;
            this.set('confirmDelete', false);
            api.requestOne('deletePlot', { id: this.get('model.plot.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plots');
                this.flashMessages.success('Plot deleted!');
            });
        }
    }
});