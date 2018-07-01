import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    confirmDelete: false,
    currentArea: null,
    
    resetOnExit: function() { 
        this.set('currentArea', null);
    },
    
    actions: {

        delete() {
            let api = this.get('gameApi');
            this.set('confirmDelete', false);
            api.requestOne('deleteArea', { id: this.get('currentArea.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('currentArea', null);
                this.send('reloadModel');
                this.get('flashMessages').success('Area deleted!');
            });
        },

        selectArea(areaName) {
            let area = this.get('model.areas').find( (a) => a.name === areaName)
            this.set('currentArea', area);
        }
    }
});