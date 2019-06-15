import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  gameSocket: service(),
  session: service(),
  flashMessages: service(),
  categoryFilter: null,
  newJobs: null,
  page: 1,
  
  filteredJobs: function(){
    let allJobs = this.get('model.jobs.jobs');
    let selectedStatus = this.get('model.status_filter').filter(s => s.selected).map(s => s.name);
    let category = this.get('categoryFilter');
    
    return allJobs.filter(j => (!category || category === j.category) && (selectedStatus.includes(j.status) || j.unread));
  }.property('model.status_filter.@each.selected', 'categoryFilter', 'model.jobs.jobs.@each.id'),
        
  setupCallback: function() {
      let self = this;
      this.get('gameSocket').set('jobsCallback', function(msg) {
          self.onJobsMessage(msg) } );
  },
  
  resetOnExit: function() {
      this.set('page', 1);
  },
  
  onJobsMessage: function(message) {
    let splitMsg = message.split('|');
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
    
    this.get('gameSocket').notify(jobMessage);
    
  },
          
  actions: {
    categoryFilterChanged(filter) {
      this.set('categoryFilter', filter);
    },
    
    clearCategoryFilter() {
      this.set('categoryFilter', null);
    },
    
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