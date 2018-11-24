import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
  calendarUrl: function() {
    var protocol = aresconfig.use_https ? 'https' : 'http';
    return `${protocol}://${aresconfig.host}/game/calendar.ics`;
  }.property()
});