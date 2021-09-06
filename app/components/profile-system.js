import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  traitsExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').any((e) => e == 'traits');
  }),

  fateExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').any((e) => e == 'fate');
  }),

  rpgExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').any((e) => e == 'rpg');
  }),

  cookiesExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').any((e) => e == 'cookies');
  }),

  prefsExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').any((e) => e == 'prefs');
  }),

  actions: {
    reloadChar() {
      this.reloadChar();
    },
  },
});
