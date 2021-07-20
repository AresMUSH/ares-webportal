import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    traitsExtraInstalled: computed(function() {
      return this.get('game.extra_plugins').any(e => e == 'traits');
    }),
    
    fateExtraInstalled: computed(function() {
      return this.get('game.extra_plugins').any(e => e == 'fate');
    }),
    
    rpgExtraInstalled: computed(function() {
      return this.get('game.extra_plugins').any(e => e == 'rpg');
    }),
    
    cookiesExtraInstalled: computed(function() {
      return this.get('game.extra_plugins').any(e => e == 'cookies');
    }),
    
    prefsExtraInstalled: computed(function() {
      return this.get('game.extra_plugins').any(e => e == 'prefs');
    }),
    
    actions: { 
        reloadChar() {
            this.reloadChar();
        }
    }
});
