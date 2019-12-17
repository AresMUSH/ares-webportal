import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    queryParams: [ 'title' ],
    template: null,

    init: function() {
      this._super(...arguments);
      this.set('template', { title: 'blank', text: '' });
    },
    
    resetOnExit: function() {
        this.set('title', null);
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
          this.set('template', template);
        }
    }
});