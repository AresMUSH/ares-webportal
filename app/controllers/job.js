import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  reply: '',
  replyAdminOnly: true,
    
  gameApi: service(),
  session: service(),
  flashMessages: service(),
    
  setup: function() {
    this.set('reply', '');
    this.set('replyAdminOnly', this.get('model.is_job_admin') ? true : false );
  }.observes('model'),
    

  actions: {
    addReply() {
      let api = this.get('gameApi');
      api.requestOne('jobReply', { id: this.get('model.id'), 
      reply: this.get('reply'),
      admin_only: this.get('replyAdminOnly')}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('reply', '');
        this.set('replyAdminOnly', true);
        this.send('reloadModel');
        this.get('flashMessages').success('Reply added!');
      });
    },
    closeJob() {
      let api = this.get('gameApi');
      api.requestOne('jobClose', { id: this.get('model.id')})
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('reply', '');
        this.set('replyAdminOnly', true);
        this.transitionToRoute('jobs');
        this.get('flashMessages').success('Reply added!');
      });
    },
    assignJob(assignee) {
      let api = this.get('gameApi');
      api.requestOne('jobAssign', { id: this.get('model.id'), assignee_id: assignee.id })
      .then((response) => {
        if (response.error) {
          return;
        }
        this.send('reloadModel');
        this.get('flashMessages').success('Assigned to ' + assignee.name  + '!');
      });
    },
    changeData(type, data) {
      this.get('gameApi').requestOne('jobChangeData', { id: this.get('model.id'), type: type, data: data })
      .then((response) => {
        if (response.error) {
          return;
        }
        this.send('reloadModel');
        this.get('flashMessages').success('Job changed to ' + data + '.');
      });
    }
  }
});