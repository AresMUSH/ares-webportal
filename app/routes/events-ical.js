import Route from '@ember/routing/route';

export default Route.extend({
    
    beforeModel: function() {
        window.location.replace("/game/calendar.ics");
        this.transitionTo('events');
    },
});
