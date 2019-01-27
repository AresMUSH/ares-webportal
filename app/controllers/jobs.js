import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  session: service(),
  flashMessages: service(),
  categoryFilter: null,
  
  filteredJobs: function(){
    let allJobs = this.get('model.jobs');
    let selectedStatus = this.get('model.status_filter').filter(s => s.selected).map(s => s.name);
    let category = this.get('categoryFilter');
    
    return allJobs.filter(j => (!category || category === j.category) && selectedStatus.includes(j.status));
  }.property('model.status_filter.@each.selected', 'categoryFilter'),
        
        
  actions: {
    categoryFilterChanged(filter) {
      this.set('categoryFilter', filter);
    },
    
    clearCategoryFilter() {
      this.set('categoryFilter', null);
    },
    
    filterJobs(filter) {
      let api = this.get('gameApi');
      api.requestOne('jobsFilter', { filter: filter }, null)
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