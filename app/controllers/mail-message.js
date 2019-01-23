import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  subject: '',
  message: '',
  toList: '',
  fwdToList: '',
  newTag: '',
  confirmDelete: false,

  resetOnExit: function() {
    this.set('confirmDelete', false);
  },
  
  setup: function() {
    this.set('subject', `Re: ${this.get('model.subject')}`);
    this.set('toList', this.get('model.from'));
    this.set('fwdToList', '');
    this.set('message', '');
    this.set('newTag', '');
  }.observes('model'),
  
  saveTags: function() {
    let api = this.get('gameApi');
    api.requestOne('tagMail', { id: this.get('model.id'), tags: this.get('model.tags') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.get('flashMessages').success('Tags updated!');
    });
  },
    
  actions: {
    sendReply: function() {
      let api = this.get('gameApi');
      api.requestOne('sendMail', { subject: this.get('subject'), 
      message: this.get('message'),
      to_list: this.get('toList')}, null)
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
      to_list: this.get('fwdToList')}, null)
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
    addNewTag: function() {
      let tags = this.get('model.tags');
      let newTag = this.get('newTag');
      
      if (newTag === '') {
        return;
      }
      
      tags.push(newTag);
      this.set('model.tags', tags);
      this.saveTags();
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
    },
    tagsChanged: function(tags) {
      this.set('model.tags', tags);
      this.saveTags();
    },
    replyAll: function() {
      this.set('toList', this.get('model.reply_all'));
    }
  }
});