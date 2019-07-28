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
            let api = this.get('gameApi');
            api.requestOne('createEvent', { title: this.get('title'), 
               date: this.get('date'),
               time: this.get('time'),
               content_warning: this.get('content_warning'),
               description: this.get('description') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('event',                          
                          response.id);
                this.get('flashMessages').success('Event added!');
            });
        }
    }
});