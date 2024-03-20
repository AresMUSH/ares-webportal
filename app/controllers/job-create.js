import Controller from '@ember/controller';
import { action } from '@ember/object';
import dayjs from 'dayjs';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  router: service(),
  session: service(),
    
  title: '',
  category: '',
  description: '',
  template: '',
  tags: '',
  submitter: null,
  customFields: {},
  participants: null,

  init: function() {
    this._super(...arguments);
    this.set('participants', []);
  },
  setupController: function() {
    this.setCategory(this.model.get('options.request_category'));
    this.set('submitter', this.model.get('characters').find(c => c.id == this.get('session.data.authenticated.id')));
    this.set('customFields', this.get('model.options.custom_fields'));
  },
     
  resetOnExit: function() {
    this.set('title', '');
    this.setCategory(this.get('model.options.request_category'));
    this.set('description', '');
    this.set('submitter', null);
    this.set('participants', []);
  },
  
  setCategory: function(cat) {
    this.set('category', cat);
    let category_template = this.get(`model.options.category_templates.${cat}`);
    if (!this.description || this.description == this.template) {
      this.set('description', category_template);
    }
    this.set('template', category_template);
  },
    
  @action    
  changeCustomDate(val, dateStr, instance) {
    var fieldName = instance.element.id.split('-')[1];
    this.set(`customFields.${fieldName}.value`, val);
    this.set(`customFields.${fieldName}.date_input`, dayjs(val).format(this.get('model.options.date_entry_format')));
  },
    
  @action  
  changeCustomDropdown(id, val) {
    this.set(`customFields.${id}.value`, val);
  },
      
  actions: {
    changeCategory: function(cat) {
      this.setCategory(cat);
    },
      
    createJob: function() {
      let api = this.gameApi;
      
      let tags = this.tags || [];
      if (!Array.isArray(tags)) {
          tags = tags.split(/[\s,]/);
      }
      
      api.requestOne('jobCreate', { 
        title: this.title, 
        category: this.category || this.get('model.options.request_category'),
        description: this.description,
        participants: (this.participants || []).map(p => p.id),
        submitter: this.get('submitter.name'),
        custom_fields: this.get('customFields'),
        tags: tags }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.router.transitionTo('job', response.id);
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