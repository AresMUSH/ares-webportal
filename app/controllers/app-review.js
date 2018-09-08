import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    appNotes: '',
    
    actions: {
        approveChar() {
            let api = this.get('gameApi');
            api.requestOne('appApprove', { id: this.get('model.id'), notes: this.get('appNotes')  }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('appNotes', '');
              this.get('flashMessages').success('Character approved!');
              this.transitionToRoute('char', this.get('model.name'));
            });
        },
        rejectChar() {
            let api = this.get('gameApi');
            api.requestOne('appReject', { id: this.get('model.id'), notes: this.get('appNotes') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
              this.set('appNotes', '');
              this.get('flashMessages').success('Character rejected!');
              this.transitionToRoute('jobs');
           });
        }
    }
});