import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
    
  title: '',
  category: '',
  description: '',
  submitter: null,
  participants: [],
    
  resetOnExit: function() {
    this.set('title', '');
    this.set('category', this.get('model.options.request_category'));
    this.set('description', '');
    this.set('submitter', null);
    this.set('participants', []);
  },
    
  actions: {
    changeCategory: function(cat) {
      this.set('category', cat);
    },
      
    createJob: function() {
      let api = this.gameApi;
      api.requestOne('jobCreate', { 
        title: this.title, 
        category: this.category || this.get('model.options.request_category'),
        description: this.description,
        participants: (this.participants || []).map(p => p.id),
        submitter: this.get('submitter.name') }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.transitionToRoute('job', response.id);
          this.flashMessages.success('Job created!');
        });
      },
      
      participantsChanged: function(newParticipants) {
          this.set('participants', newParticipants);
      },

      submitterChanged(submitter) {
          this.set('submitter', submitter);
      },
    }
  });