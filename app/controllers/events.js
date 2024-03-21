import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Controller.extend(AuthenticatedController, AresConfig, {
  calendarUrl: computed(function() {
    let protocol = this.httpsEnabled ? 'https' : 'http';
    return `${protocol}://${this.mushHost}/game/calendar.ics`;
  })
});