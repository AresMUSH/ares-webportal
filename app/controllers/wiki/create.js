import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    flashMessages: service(),
    
    actions: {
        
        save() {
            let aj = this.get('ajax');
            let tags = this.get('model.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            aj.queryOne('createWiki', {
               title: this.get('model.title'), 
               text: this.get('model.text'),
               tags: tags})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('wiki.page',                          
                          response.name);
                this.get('flashMessages').success('Page created!');
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});