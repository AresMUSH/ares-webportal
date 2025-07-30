import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  router: service(),
  replySubject: '',
  fwdSubject: '',
  replyMessage: '',
  fwdMessage: '',
  replyToList: null,
  fwdToList: null,
  newTag: '',
  showReplyBox: false,
  showForwardBox: false,

  init: function() {
    this._super(...arguments);
    this.set('fwdToList', []);
    this.set('replyToList', []);
  },
  
  setup: function() {
    this.set('replySubject', `Re: ${this.get('model.message.subject')}`);
    this.set('fwdSubject', `Fwd: ${this.get('model.message.subject')}`);
    this.set('replyToList', this.get('model.characters').filter(c => c.name === this.get('model.message.from')));
    this.set('fwdToList', []);
    this.set('replyMessage', '');
    this.set('fwdMessage', '');
    this.set('newTag', '');
    this.set('showReplyBox', false);
    this.set('showForwardBox', false);    
  },
  
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
    
  @action
  addNewTag() {
    let newTag = this.newTag;
      
    if (newTag === '') {
      return;
    }
      
    pushObject(this.get('model.message.tags'), newTag, this.model.message, 'tags');
    this.saveTags();
  },
    
  @action
  archiveMsg() {
    let api = this.gameApi;
    api.requestOne('archiveMail', { id: this.get('model.message.id') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('mail');
      this.flashMessages.success('Message archived!');
    });
  },
    
  @action
  moveToTrash() {
    let api = this.gameApi;
    api.requestOne('deleteMail', { id: this.get('model.message.id') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('mail');
      this.flashMessages.success('Message moved to trash.');
    });
  },
    
  @action
  fwdToListChanged(list) {
    this.set('fwdToList', list);
  },
    
  @action
  replyAll() {      
    this.set('replyToList', this.get('model.characters').filter(c =>this.get('model.message.reply_all').includes(c.name)));
  },
    
  @action
  sendReply() {
    let api = this.gameApi;
    api.requestOne('sendMail', 
    {
      subject: this.replySubject, 
      message: this.replyMessage,
      sender: this.get('model.message.recipient'),
      to_list: (this.replyToList || []).map (p => p.name )
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('mail');
      this.flashMessages.success('Sent!');
    });
  },
    
  @action
  sendForward() {
    let api = this.gameApi;
    api.requestOne('sendMail', 
    {
      subject: this.fwdSubject, 
      message: `${this.fwdMessage}\n\n----\n\nOriginal Message:\n${this.get('model.message.raw_body')}`,
      sender: this.get('model.message.recipient'),
      to_list: (this.fwdToList || []).map (p => p.name )
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('mail');
      this.flashMessages.success('Sent!');
    });
  },
    
  @action
  tagsChanged(tags) {
    this.set('model.message.tags', tags);
    this.saveTags();
  },
    
  @action
  replyToListChanged(list) {
    this.set('replyToList', list);
  },
    
  @action
  uneleteMsg() {
    let api = this.gameApi;
    api.requestOne('undeleteMail', { id: this.get('model.message.id') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('mail');
      this.flashMessages.success('Message undeleted.');
    });
  },
  
  @action
  setShowReplyBox() {
    this.set('showReplyBox', true);
    this.set('showForwardBox', false);
  },
  
  @action
  setShowForwardBox() {
    this.set('showForwardBox', true);
    this.set('showReplyBox', false);
  }
  
});