import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import dayjs from 'dayjs';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    
    warning_tags: [],
  
    actions: {
        organizerChanged(org) {
          this.set('model.event.organizer', org);
        },
        changeDate: function(date) {
            let formatted_date = dayjs(date).format(this.get('model.event.date_entry_format')); //moment(date).format(this.get('model.event.date_entry_format'));
            this.set('model.event.date', formatted_date);  
        },
        edit: function() {
            let api = this.gameApi;
            
            let tags = this.model.event.tags || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('editEvent', { event_id: this.get('model.event.id'),
               title: this.get('model.event.title'), 
               date: this.get('model.event.date'),
               time: this.get('model.event.time'),
               organizer: this.get('model.event.organizer.name'),
               tags: tags,
               content_warning: this.get('model.event.content_warning'),
               description: this.get('model.event.description') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.router.transitionTo('event',                          
                          this.get('model.event.id'));
                this.flashMessages.success('Event updated!');
            });
        },
        warningsChanged(new_warnings) {
          this.set('warning_tags', new_warnings);
          this.set('model.event.content_warning', new_warnings.join(', '));
        },
    }
});