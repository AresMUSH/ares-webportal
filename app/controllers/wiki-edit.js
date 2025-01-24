import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  router: service(),
  previewText: null,
  minorEdit: false,
    
  resetOnExit: function() {
    this.set('previewText', null);
    this.set('minorEdit', false);
  },
    
  @action   
  cancel() {
    let api = this.gameApi;
            
    api.requestOne('editWikiCancel', { id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('wiki-page',                          
      this.get('model.name'));
    });
  },
        
  @action
  preview() {
    let api = this.gameApi;
            
    api.requestOne('markdownPreview', { text: this.get('model.text') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('previewText', response.text);
    });
  },
        
  @action
  save() {
    let api = this.gameApi;
   
    api.requestOne('editWiki', 
    { 
      id: this.get('model.id'),
      title: this.get('model.title'), 
      name: this.get('model.name'),
      text: this.get('model.text'),
      minor_edit: this.minorEdit,
      tags: this.get('model.tags')
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('wiki-page', this.get('model.name'));
      this.flashMessages.success('Page updated!');
    });
  }
});