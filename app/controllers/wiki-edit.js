import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    flashMessages: service(),
    preview: null,
    
    resetOnExit: function() {
        this.set('preview', null);
    },
    
    actions: {
        
        preview() {
            let aj = this.get('ajax');
            
            aj.requestOne('wikiPreview', { text: this.get('model.text') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('preview', response.text);
            });
        },
        
        save() {
            let aj = this.get('ajax');
            let tags = this.get('model.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            aj.requestOne('editWiki', { id: this.get('model.id'),
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