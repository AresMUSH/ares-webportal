import { computed } from '@ember/object';
import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  traitsExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').some((e) => e == 'traits');
  }),

  fateExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').some((e) => e == 'fate');
  }),

  rpgExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').some((e) => e == 'rpg');
  }),

  cookiesExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').some((e) => e == 'cookies');
  }),

  prefsExtraInstalled: computed('game.extra_plugins', function () {
    return this.get('game.extra_plugins').some((e) => e == 'prefs');
  }),

  @action
    reloadChar() {
      this.onReloadChar();
    },
});
