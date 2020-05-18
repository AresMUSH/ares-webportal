import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Controller.extend(AuthenticatedController, AresConfig, {
  calendarUrl: computed(function() {
    var protocol = aresconfig.use_https ? 'https' : 'http';
    return `${protocol}://${aresconfig.host}/game/calendar.ics`;
  })
});