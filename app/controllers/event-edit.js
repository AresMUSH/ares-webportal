import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    
    actions: {
        changeDate: function(date) {
            let formatted_date = moment(date).format(this.get('model.date_entry_format'));
            this.set('model.date', formatted_date);  
        },
        edit: function() {
            let api = this.get('gameApi');
            api.requestOne('editEvent', { event_id: this.get('model.id'),
               title: this.get('model.title'), 
               date: this.get('model.date'),
               time: this.get('model.time'),
               content_warning: this.get('model.content_warning'),
               description: this.get('model.description') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('event',                          
                          this.get('model.id'));
                this.get('flashMessages').success('Event updated!');
            });
        }
    }
});