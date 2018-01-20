import Route from '@ember/routing/route';

export default Route.extend({
    
    beforeModel: function() {
        window.location.replace("/calendar.ics");
        this.transitionTo('events');
    },
});
