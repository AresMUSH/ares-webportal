import Controller from '@ember/controller';
import { action } from '@ember/object';
import dayjs from 'dayjs';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  router: service(),
  
  @action    
  changeCustomDate(val, dateStr, instance) {
    var fieldName = instance.element.id.split('-')[1];
    this.set(`model.job.custom_fields.${fieldName}.value`, val);
    this.set(`model.job.custom_fields.${fieldName}.date_input`, dayjs(val).format(this.get('model.options.date_entry_format')));
  },
    
  @action  
  changeCustomDropdown(id, val) {
    this.set(`model.job.custom_fields.${id}.value`, val);
  },
  
  actions: {
    changeCategory: function(cat) {
      this.set('model.job.category', cat);
    },
    
    changeStatus: function(status) {
      this.set('model.job.status', status);
    },    
    
    saveJob: function() {
      let api = this.gameApi;
      
      let tags = this.get('model.job.tags') || [];
      if (!Array.isArray(tags)) {
          tags = tags.split(/[\s,]/);
      }
            
      api.requestOne('jobSave', { 
        id: this.get('model.job.id'),
        title: this.get('model.job.title'), 
        category: this.get('model.job.category') || this.get('model.options.request_category'),
        status: this.get('model.job.status'),
        description: this.get('model.job.description'),
        assigned_to: this.get('model.job.assigned_to.name'),
        participants: (this.get('model.job.participants') || []).map(p => p.id),
        submitter: this.get('model.job.author.name'),
        custom_fields: this.get('model.job.custom_fields'),
        tags: tags }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.router.transitionTo('job', response.id);
          this.flashMessages.success('Job saved!');
        });
      },
      
      participantsChanged: function(newParticipants) {
          this.set('model.job.participants', newParticipants);
      },

      submitterChanged(submitter) {
          this.set('model.job.author', submitter);
      },
      
      assigneeChanged(assignee) {
          this.set('model.job.assigned_to', assignee);
      },
    }
  });