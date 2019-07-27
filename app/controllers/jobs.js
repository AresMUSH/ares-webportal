import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  gameSocket: service(),
  session: service(),
  flashMessages: service(),
  newJobs: null,
  page: 1,
  
  setupCallback: function() {
      let self = this;
      this.get('gameSocket').setupCallback('job_update', function(type, msg, timestamp) {
          self.onJobsMessage(type, msg, timestamp) } );
  },
  
  resetOnExit: function() {
      this.set('page', 1);
      this.set('newJobs', null);
  },
  
  onJobsMessage: function(type, msg, timestamp) {
    let splitMsg = msg.split('|');
    let jobId = splitMsg[0];
    let jobMessage = splitMsg[1];
    let found = false;
    
    this.get('model.jobs.jobs').forEach((j) => {
      if (j.id === jobId) {
        Ember.set(j, `unread`, true);
        found = true;
      }
    });  
    
    if (!found) {
      this.set('newJobs', true);
    }    
  },
  
  
  actions: {

    
    goToPage(newPage) {
      this.set('page', newPage);
      let api = this.get('gameApi');
      api.requestOne('jobs', { page: newPage }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('model.jobs', response);
      });
    },
    
    filterJobs(filter) {
      this.set('page', 1);
      let api = this.get('gameApi');
      api.requestOne('jobsFilter', { filter: filter, page: 1 }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.send('reloadModel');
        this.get('flashMessages').success('Jobs filtered!');
      });
    }
  }
});