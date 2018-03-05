import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    preview: null,
    
    resetOnExit: function() {
        this.set('preview', null);
    },
    
    actions: {
        
        preview() {
            let api = this.get('gameApi');
            
            api.requestOne('markdownPreview', { text: this.get('model.text') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('preview', response.text);
            });
        },
        
        save() {
            let api = this.get('gameApi');
            let tags = this.get('model.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('editWiki', { id: this.get('model.id'),
               title: this.get('model.title'), 
               name: this.get('model.name'),
               text: this.get('model.text'),
               tags: tags}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('wiki-page',                          
                          this.get('model.name'));
                this.get('flashMessages').success('Page updated!');
            });
        }
    }
});