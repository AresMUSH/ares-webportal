import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    session: service(),
    
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
    
    actions: {
        storytellersChanged(new_storytellers) {
          this.set('storytellers', new_storytellers);
        },
        
        save: function() {
            let api = this.gameApi;
            
            let tags = this.get('tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('createPlot', { 
               title: this.title, 
               summary: this.summary,
               content_warning: this.get('contentWarning'),
               storytellers: (this.get('storytellers') || []).map(storyteller => storyteller.name),
               description: this.description,
              tags: tags
            }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plot',                          
                          response.id);
                this.flashMessages.success('Plot created!');
            });
        }
    }
});