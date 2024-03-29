import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Controller.extend(AresConfig, {
  mushVersion: computed(function() {
      return this.mushVersion;
  }),
  portalVersion: computed(function() {
    return aresweb_version;
  }),
  versionWarning: computed('mushVersion', 'portalVersion', function() {
    return this.mushVersion != this.portalVersion;
  })
});