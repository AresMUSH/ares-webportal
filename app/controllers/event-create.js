import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    title: '',
    date: '',
    time: '',
    description: '',
    content_warning: '',
    
    resetOnExit: function() {
        this.set('title', '');
        this.set('date', '');
        this.set('time', '');
        this.set('description', '');
        this.set('content_warning', '');
    },
    
    actions: {
        changeDate: function(date) {
            let formatted_date = moment(date).format(this.get('model.game.date_entry_format'));
            this.set('date', formatted_date);  
        },
        create: function() {
            let api = this.gameApi;
            api.requestOne('createEvent', { title: this.title, 
               date: this.date,
               time: this.time,
               content_warning: this.content_warning,
               description: this.description }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('event',                          
                          response.id);
                this.flashMessages.success('Event added!');
            });
        }
    }
});