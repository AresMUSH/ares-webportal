import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  session: service(),
  flashMessages: service(),
  
  filteredJobs: function(){
    let allJobs = this.get('model.jobs');
    let selectedStatus = this.get('model.status_filter').filter(s => s.selected).map(s => s.name);
    let selectedCategory = this.get('model.category_filter').filter(s => s.selected).map(s => s.name);
    
    return allJobs.filter(j => selectedCategory.includes(j.category) && selectedStatus.includes(j.status));
  }.property('model.status_filter.@each.selected', 'model.category_filter.@each.selected'),
        
        
  actions: {
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