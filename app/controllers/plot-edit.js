import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    
    actions: {
        save: function() {
            let api = this.get('gameApi');
            api.requestOne('editPlot', { id: this.get('model.id'),
               title: this.get('model.title'), 
               summary: this.get('model.summary'),
               description: this.get('model.description')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plot',                          
                          this.get('model.id'));
                this.get('flashMessages').success('Plot updated!');
            });
        }
    }
});