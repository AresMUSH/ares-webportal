import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    ajax: service(),
    
    actions: {
        save: function() {
            let aj = this.get('ajax');
            aj.queryOne('editPlot', { id: this.get('model.id'),
               title: this.get('model.title'), 
               summary: this.get('model.summary'),
               description: this.get('model.description')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plots.plot',                          
                          this.get('model.id'));
                this.get('flashMessages').success('Plot updated!');
            })
            .catch((response) => {
                this.get('flashMessages').danger(response);
            });
        }
    }
});