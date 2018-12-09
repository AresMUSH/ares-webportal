import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    
    actions: {
        storytellerChanged(storyteller) {
          this.set('model.plot.storyteller', storyteller);
        },
        
        save: function() {
            let api = this.get('gameApi');
            api.requestOne('editPlot', { id: this.get('model.plot.id'),
               title: this.get('model.plot.title'), 
               summary: this.get('model.plot.summary'),
               storyteller_id: this.get('model.plot.storyteller.id'),
               description: this.get('model.plot.description')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plot',                          
                          this.get('model.plot.id'));
                this.get('flashMessages').success('Plot updated!');
            });
        }
    }
});