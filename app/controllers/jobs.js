import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  session: service(),
  flashMessages: service(),
    
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