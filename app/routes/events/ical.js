import Route from '@ember/routing/route';

export default Route.extend({
    
    beforeModel: function(params) {
        window.location.replace("/calendar.ics");
        //let url = '/calendar.ics';
        //window.open(url, 'Download');
        //window.downloadFile(url, 'calendar.ics');
        this.transitionTo('events');
    },
});
