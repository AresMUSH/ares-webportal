import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  mushVersion: computed(function() {
      return aresconfig.version;
  }),
  portalVersion: computed(function() {
    return aresweb_version;
  }),
  versionWarning: computed('mushVersion', 'portalVersion', function() {
    return this.get('mushVersion') != this.get('portalVersion');
  })
});