import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    subject: '',
    message: '',
    sender: null,
    toList: null,

    init: function() {
      this._super(...arguments);
      this.set('toList', []);
    },
      
    resetOnExit: function() {
        this.set('subject', '');
        this.set('message', '');
        this.set('toList', []);
        this.set('sender', null);
    },
    
    setup: function() {
      this.set('sender', this.get('model.sendOptions.authorableChars')[0]);
    },
    
    actions: {
        sendMail: function() {
            let api = this.gameApi;
            api.requestOne('sendMail', { subject: this.subject, 
               message: this.message,
                sender: this.sender.name,
               to_list: (this.toList || []).map(p => p.name) }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.router.transitionTo('mail');
                this.flashMessages.success('Sent!');
            });
        },
        toListChanged(newList) {
            this.set('toList', newList);
        },
        senderChanged(char) {
          this.set('sender', char);
        }
    }
});