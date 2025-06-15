import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  gameApi: service(),
  router: service(),
  flashMessages: service(),
  selectSkillRoll: false,
  
  handleApproval: function(approved) {
    this.gameApi.requestOne('approveRoster', { name: this.get('job.roster_name'), approved: approved })
    .then((response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('jobs');
      this.flashMessages.success('Roster app ' + (approved ? 'approved.' : 'rejected.'));
    });
  },
  
  @action
  closeJob() {
    let api = this.gameApi;
    api.requestOne('jobClose', { id: this.get('job.id')})
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('jobs');
      this.flashMessages.success('Job closed.');
    });
  },
    
  @action
  approveRoster() {
    this.handleApproval(true);
  },
    
  @action
  rejectRoster() {
    this.handleApproval(false);
  },
  
  @action
  showSelectSkillRoll(value) {
    this.set('selectSkillRoll', value);
  },
  
  
});
