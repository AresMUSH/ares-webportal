import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  reply: '',
  replyAdminOnly: true,
  editParticipants: false,
  newParticipants: [],
    
  gameApi: service(),
  session: service(),
  flashMessages: service(),
  
    
  setup: function() {
    this.set('reply', '');
    this.set('replyAdminOnly', this.get('model.job.is_category_admin') ? true : false );
    this.set('editParticipants', false);
    this.set('newParticipants', this.get('model.job.participants'));
  }.observes('model'),
    

  actions: {
    addReply() {
      let api = this.gameApi;
      api.requestOne('jobReply', { id: this.get('model.job.id'), 
      reply: this.reply,
      admin_only: this.replyAdminOnly}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('reply', '');
        this.set('replyAdminOnly', true);
        this.send('reloadModel');
        this.flashMessages.success('Reply added!');
      });
    },
    closeJob() {
      let api = this.gameApi;
      api.requestOne('jobClose', { id: this.get('model.job.id')})
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('reply', '');
        this.set('replyAdminOnly', true);
        this.transitionToRoute('jobs');
        this.flashMessages.success('Reply added!');
      });
    },
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
    participantsChanged: function(newParticipants) {
        this.set('newParticipants', newParticipants);
    },
    saveParticipants: function() {
      let participants = this.newParticipants;
      this.set('editParticipants', false);
      this.set('newParticipants', []);
      this.gameApi.requestOne('jobChangeParticipants', { id: this.get('model.job.id'), participants: participants.map(p => p.id) })
      .then((response) => {
        if (response.error) {
          return;
        }
        this.send('reloadModel');
        this.flashMessages.success('Participants saved.');
      });
    }
  }
});