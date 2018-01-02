import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webclient/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    flashMessages: service(),
    
    actions: {
        changeDate: function(date) {
            let formatted_date = moment(date).format(this.get('model.date_entry_format'));
            this.set('model.date', formatted_date);  
        },
        edit: function() {
            let aj = this.get('ajax');
            aj.queryOne('editEvent', { event_id: this.get('model.id'),
               title: this.get('model.title'), 
               date: this.get('model.date'),
               time: this.get('model.time'),
               description: this.get('model.description') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('Event updated!');
                this.transitionToRoute('events.event',                          
                          this.get('model.id'));
            })
            .catch((response) => {
                this.get('flashMessages').danger(response.message);
            });
        }
    }
});