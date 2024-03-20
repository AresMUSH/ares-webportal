import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',
  gameApi: service(),
  router: service(),
  flashMessages: service(),
  selectSkillRoll: false,
  
  approveRoster: function(approved) {
    this.gameApi.requestOne('approveRoster', { name: this.get('job.roster_name'), approved: approved })
    .then((response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('jobs');
      this.flashMessages.success('Roster app ' + (approved ? 'approved.' : 'rejected.'));
    });
  },
  
  
  actions: {
    
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
    approveRoster: function() {
      this.approveRoster(true);
    },
    
    rejectRoster: function() {
      this.approveRoster(false);
    }
  }
  
});
