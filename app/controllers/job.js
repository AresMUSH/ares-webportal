import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend({
  reply: '',
  replyAdminOnly: true,
  editParticipants: false,
  newParticipants: null,
  newActivity: false,
      
  gameApi: service(),
  gameSocket: service(),
  session: service(),
  flashMessages: service(),
  router: service(),

  init: function() {
    this._super(...arguments);
    this.set('newParticipants', []);
  },
      
  resetReplyAdmin: function() {
    this.set('replyAdminOnly', this.get('model.job.is_category_admin') ? true : false );
  },
  
  setup: function() {
    this.set('reply', '');
    this.set('newActivity', false);
    this.resetReplyAdmin();
    this.set('editParticipants', false);
    this.set('selectSkillRoll', false);
    this.set('newParticipants', this.get('model.job.participants'));
  },
    
  setupCallback: function() {
    let self = this;
    this.gameSocket.setupCallback('job_update', function(type, msg, timestamp) {
      self.onJobsMessage(type, msg, timestamp) 
    } );
  },
  
  onJobsMessage: function(type, msg, timestamp ) {
    let splitMsg = msg.split('|');
    let jobId = splitMsg[0]; // Message = splitMsg[1]
    let data = splitMsg[2];
    
    if (data) {
      data = JSON.parse(data);
    }
    if (jobId == this.get('model.job.id')) {
      if (data && data.type == 'job_reply') {
        pushObject(this.get('model.job.replies'), {
          admin_only: data.admin_only,
          author: data.author,
          created: timestamp,
          id: data.reply_id,
          message: data.message
        }, this.model.job, 'replies');
      } else {
        this.set('newActivity', true);  
      }      
    }
  },
  

  @action
  addReply() {
    let api = this.gameApi;
      
    if (this.reply.length === 0) {
      this.flashMessages.danger("You haven't entered anything.");
      return;
    }
    api.requestOne('jobReply', 
    {
      id: this.get('model.job.id'), 
      reply: this.reply,
      admin_only: this.replyAdminOnly
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('reply', '');
      this.resetReplyAdmin();
      this.flashMessages.success('Reply added!');
    });
  },
    
  @action
  assignJob(assignee) {
    let api = this.gameApi;
    api.requestOne('jobAssign', { id: this.get('model.job.id'), assignee_id: assignee.id })
    .then((response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Assigned to ' + assignee.name  + '!');
    });
  },
    
  @action
  deleteReply(id) {
    let api = this.gameApi;
    api.requestOne('jobDeleteReply', { id: this.get('model.job.id'), reply_id: id })
    .then((response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Reply deleted!');
    });
  },
    
  @action
  changeData(type, data) {
    this.gameApi.requestOne('jobChangeData', { id: this.get('model.job.id'), type: type, data: data })
    .then((response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Job changed to ' + data + '.');
    });
  },
    
  @action
  participantsChanged(newParticipants) {
    this.set('newParticipants', newParticipants);
  },
    
  @action
  saveParticipants() {
    let participants = this.newParticipants;
    this.set('editParticipants', false);
    this.set('newParticipants', []);
    this.gameApi.requestOne('jobChangeParticipants', 
    {
      id: this.get('model.job.id'), participants: participants.map(p => p.id) 
    })
    .then((response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Participants saved.');
    });
  },
    
  @action
  responseSelected(resp) {
    this.set('reply', resp.value);
  },
  
  @action
  setEditParticipants(value) {
    this.set('editParticipants', value);
  }
  
});