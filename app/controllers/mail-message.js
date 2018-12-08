import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  subject: '',
  message: '',
  to_list: '',
  fwd_to_list: '',
  confirmDelete: false,

  resetOnExit: function() {
    this.set('confirmDelete', false);
  },
  
  setup: function() {
    this.set('subject', `Re: ${this.get('model.subject')}`);
    this.set('to_list', this.get('model.from'));
    this.set('fwd_to_list', '');
    this.set('message', '');
  }.observes('model'),
    
  actions: {
    sendReply: function() {
      let api = this.get('gameApi');
      api.requestOne('sendMail', { subject: this.get('subject'), 
      message: this.get('message'),
      to_list: this.get('to_list')}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.get('flashMessages').success('Sent!');
      });
    },
    sendForward: function() {
      let api = this.get('gameApi');
      api.requestOne('sendMail', { subject: `Fwd: ${this.get('model.subject')}`, 
      message: `${this.get('message')}\n\n----\n\nOriginal Message:\n${this.get('model.raw_body')}`,
      to_list: this.get('fwd_to_list')}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.get('flashMessages').success('Sent!');
      });
    },
    deleteMsg: function() {
      let api = this.get('gameApi');
      api.requestOne('deleteMail', { id: this.get('model.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.get('flashMessages').success('Message moved to trash.');
      });
    },
    uneleteMsg: function() {
      let api = this.get('gameApi');
      api.requestOne('undeleteMail', { id: this.get('model.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.get('flashMessages').success('Message undeleted.');
      });
    },
    archiveMsg: function() {
      let api = this.get('gameApi');
      api.requestOne('archiveMail', { id: this.get('model.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.get('flashMessages').success('Message archived!');
      });
    }
  }
});