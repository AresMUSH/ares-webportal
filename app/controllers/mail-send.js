import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    subject: '',
    message: '',
    toList: null,

    init: function() {
      this._super(...arguments);
      this.set('toList', []);
    },
      
    resetOnExit: function() {
        this.set('subject', '');
        this.set('message', '');
        this.set('toList', []);
    },
    
    actions: {
        sendMail: function() {
            let api = this.gameApi;
            api.requestOne('sendMail', { subject: this.subject, 
               message: this.message,
               to_list: (this.toList || []).map(p => p.name) }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('mail');
                this.flashMessages.success('Sent!');
            });
        },
        toListChanged(newList) {
            this.set('toList', newList);
        },
    }
});