import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Controller.extend(AuthenticatedController, AresConfig, {
  calendarUrl: computed(function() {
    let protocol = this.get('aresconfig.use_https') ? 'https' : 'http';
    let host = this.get('aresconfig.host');
    return `${protocol}://${host}/game/calendar.ics`;
  })
});