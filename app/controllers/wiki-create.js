import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    queryParams: [ 'title' ],

    actions: {
        
        save() {
            let api = this.get('gameApi');
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
                this.get('flashMessages').success('Page created!');
            });
        }
    }
});