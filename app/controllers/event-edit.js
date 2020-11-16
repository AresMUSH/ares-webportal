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
            let api = this.gameApi;
            
            let tags = this.model.tags || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('editEvent', { event_id: this.get('model.id'),
               title: this.get('model.title'), 
               date: this.get('model.date'),
               time: this.get('model.time'),
               tags: tags,
               content_warning: this.get('model.content_warning'),
               description: this.get('model.description') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('event',                          
                          this.get('model.id'));
                this.flashMessages.success('Event updated!');
            });
        }
    }
});