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
    
    actions: { 
        reloadChar() {
            this.reloadChar();
        }
    }
});
