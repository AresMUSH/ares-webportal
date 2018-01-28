import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    ajax: service(),
    
    title: '',
    summary: '',
    description: '',
    
    resetOnExit: function() {
        this.set('title', '');
        this.set('summary', '');
        this.set('description', '');
    },
    
    actions: {
        save: function() {
            let aj = this.get('ajax');
            aj.requestOne('createPlot', { 
               title: this.get('title'), 
               summary: this.get('summary'),
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