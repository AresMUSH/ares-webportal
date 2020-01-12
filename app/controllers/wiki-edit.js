import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    preview: null,
    minorEdit: false,
    
    resetOnExit: function() {
        this.set('preview', null);
        this.set('minorEdit', null);
    },
    
    actions: {
        
        cancel() {
            let api = this.gameApi;
            
            api.requestOne('editWikiCancel', { id: this.get('model.id') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('wiki-page',                          
                          this.get('model.name'));
            });
        },
        
        preview() {
            let api = this.gameApi;
            
            api.requestOne('markdownPreview', { text: this.get('model.text') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('preview', response.text);
            });
        },
        
        save() {
            let api = this.gameApi;
            let tags = this.get('model.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('editWiki', { id: this.get('model.id'),
               title: this.get('model.title'), 
               name: this.get('model.name'),
               text: this.get('model.text'),
               minor_edit: this.get('minorEdit'),
               tags: tags}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('wiki-page',                          
                          this.get('model.name'));
                this.flashMessages.success('Page updated!');
            });
        }
    }
});