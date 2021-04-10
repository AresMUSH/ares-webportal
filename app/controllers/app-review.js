import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    appNotes: '',
    
    actions: {
        approveChar() {
            let api = this.gameApi;
            api.requestOne('appApprove', { id: this.get('model.id'), notes: this.appNotes  }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('appNotes', '');
              this.flashMessages.success('Character approved!');
              this.transitionToRoute('char', this.get('model.name'));
            });
        },
        rejectChar() {
            let api = this.gameApi;
            api.requestOne('appReject', { id: this.get('model.id'), notes: this.appNotes }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
              this.set('appNotes', '');
              this.flashMessages.success('Character rejected!');
              this.transitionToRoute('jobs');
           });
        },
        responseSelected: function(resp) {
          this.set('appNotes', resp.value);
        }
    }
});