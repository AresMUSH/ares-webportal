import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    session: service(),
    
    title: '',
    summary: '',
    description: '',
    storyteller: null,
    
    resetOnExit: function() {
        this.set('title', '');
        this.set('summary', '');
        this.set('description', '');
        this.set('storyteller', null);
    },
    
    actions: {
        storytellerChanged(storyteller) {
          this.set('storyteller', storyteller);
        },
        
        save: function() {
            let api = this.gameApi;
            api.requestOne('createPlot', { 
               title: this.title, 
               summary: this.summary,
               content_warning: this.get('model.plot.content_warning'),
               storyteller_id: this.get('storyteller.id'),
               description: this.description}, null)
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