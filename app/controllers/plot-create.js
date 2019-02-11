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
            let api = this.get('gameApi');
            api.requestOne('createPlot', { 
               title: this.get('title'), 
               summary: this.get('summary'),
               storyteller_id: this.get('storyteller.id'),
               description: this.get('description')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plot',                          
                          response.id);
                this.get('flashMessages').success('Plot created!');
            });
        }
    }
});