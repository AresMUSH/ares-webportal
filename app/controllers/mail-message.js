import Controller from '@ember/controller';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  replySubject: '',
  fwdSubject: '',
  replyMessage: '',
  fwdMessage: '',
  replyToList: null,
  fwdToList: null,
  newTag: '',
  confirmDelete: false,

  init: function() {
    this._super(...arguments);
    this.set('fwdToList', []);
    this.set('replyToList', []);
  },
  
  resetOnExit: function() {
    this.set('confirmDelete', false);
  },
  
  setup: observer('model.message', function() {
    this.set('replySubject', `Re: ${this.get('model.message.subject')}`);
    this.set('fwdSubject', `Fwd: ${this.get('model.message.subject')}`);
    this.set('replyToList', this.get('model.characters').filter(c => c.name === this.get('model.message.from')));
    this.set('fwdToList', []);
    this.set('replyMessage', '');
    this.set('fwdMessage', '');
    this.set('newTag', '');
  }),
  
  saveTags: function() {
    let api = this.gameApi;
    api.requestOne('tagMail', { id: this.get('model.message.id'), tags: this.get('model.message.tags') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Tags updated!');
    });
  },
    
  actions: {

    addNewTag: function() {
      let tags = this.get('model.message.tags');
      let newTag = this.newTag;
      
      if (newTag === '') {
        return;
      }
      
      tags.push(newTag);
      this.set('model.message.tags', tags);
      this.saveTags();
    },
    archiveMsg: function() {
      let api = this.gameApi;
      api.requestOne('archiveMail', { id: this.get('model.message.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.flashMessages.success('Message archived!');
      });
    },
    deleteMsg: function() {
      let api = this.gameApi;
      api.requestOne('deleteMail', { id: this.get('model.message.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.flashMessages.success('Message moved to trash.');
      });
    },
    fwdToListChanged: function(list) {
      this.set('fwdToList', list);
    },
    replyAll: function() {      
      this.set('replyToList', this.get('model.characters').filter(c =>this.get('model.message.reply_all').includes(c.name)));
    },
    
    sendReply: function() {
      let api = this.gameApi;
      api.requestOne('sendMail', { subject: this.replySubject, 
      message: this.replyMessage,
      to_list: (this.replyToList || []).map (p => p.name )}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.flashMessages.success('Sent!');
      });
    },
    sendForward: function() {
      let api = this.gameApi;
      api.requestOne('sendMail', { subject: this.fwdSubject, 
      message: `${this.fwdMessage}\n\n----\n\nOriginal Message:\n${this.get('model.message.raw_body')}`,
      to_list: (this.fwdToList || []).map (p => p.name )}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.flashMessages.success('Sent!');
      });
    },
    tagsChanged: function(tags) {
      this.set('model.message.tags', tags);
      this.saveTags();
    },
    replyToListChanged: function(list) {
      this.set('replyToList', list);
    },
    uneleteMsg: function() {
      let api = this.gameApi;
      api.requestOne('undeleteMail', { id: this.get('model.message.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('mail');
        this.flashMessages.success('Message undeleted.');
      });
    }
  }
});