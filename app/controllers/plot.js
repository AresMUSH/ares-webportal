import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    confirmDelete: false,

    actions: {
        delete() {
            let aj = this.get('ajax');
            this.set('confirmDelete', false);
            aj.requestOne('deletePlot', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plots');
                this.get('flashMessages').success('Plot deleted!');
            });
        }
    }
});