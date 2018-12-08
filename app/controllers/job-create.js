import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
    
  title: '',
  category: '',
  description: '',
    
  resetOnExit: function() {
    this.set('title', '');
    this.set('category', this.get('model.request_category'));
    this.set('description', '');
  },
    
  actions: {
    changeCategory: function(cat) {
      this.set('category', cat);
    },
      
    createJob: function() {
      let api = this.get('gameApi');
      api.requestOne('jobCreate', { 
        title: this.get('title'), 
        category: this.get('category') || this.get('model.request_category'),
        description: this.get('description')}, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.transitionToRoute('job', response.id);
          this.get('flashMessages').success('Job created!');
        });
      }
    }
  });