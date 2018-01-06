import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    flashMessages: service(),
    preview: null,
    
    resetForm: function() {
        this.set('preview', null);
    },
    
    actions: {
        
        preview() {
            let aj = this.get('ajax');
            
            aj.queryOne('wikiPreview', { text: this.get('model.text') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('preview', response.text);
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        },
        
        save() {
            let aj = this.get('ajax');
            let tags = this.get('model.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            aj.queryOne('editWiki', { id: this.get('model.id'),
               title: this.get('model.title'), 
               name: this.get('model.name'),
               text: this.get('model.text'),
               tags: tags})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('wiki.page',                          
                          this.get('model.name'));
                this.get('flashMessages').success('Page updated!');
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});