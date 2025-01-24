import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  session: service(),
  router: service(),
    
  title: '',
  summary: '',
  description: '',
  contentWarning: '',
  storytellers: null,
  tags: '',
    
  resetOnExit: function() {
    this.set('title', '');
    this.set('summary', '');
    this.set('description', '');
    this.set('contentWarning', '');
    this.set('storytellers', null);
    this.set('tags', '');
  },
    
  @action
  storytellersChanged(new_storytellers) {
    this.set('storytellers', new_storytellers);
  },
        
  @action
  save() {
    let api = this.gameApi;
        
    api.requestOne('createPlot', 
    { 
      title: this.title, 
      summary: this.summary,
      content_warning: this.contentWarning,
      storytellers: (this.storytellers || []).map(storyteller => storyteller.name),
      description: this.description,
      tags: this.tags
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('plot',                          
      response.id);
      this.flashMessages.success('Plot created!');
    });
  }
});