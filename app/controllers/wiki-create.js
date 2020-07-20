import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    queryParams: [ 'title', 'template', 'category', 'tags' ],

    setup: function() {
      this.set('model.text', this.get('model.template.text'));
    },
    
    resetOnExit: function() {
      // Reset query params.
      this.set('tags', null);
      this.set('title', null);
      this.set('category', null);
      this.set('template', null);
    },
    
    actions: {
        
        save() {
            let api = this.gameApi;
            let tags = this.get('model.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('createWiki', {
               title: this.get('model.title'), 
               text: this.get('model.text'),
               name: this.get('model.name'),
               tags: tags}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('wiki-page',                          
                          response.name);
                this.flashMessages.success('Page created!');
            });
        },
        
        templateChanged(template) {
          this.set('model.text', template.text);
          this.set('model.template', template);
        }
    }
});