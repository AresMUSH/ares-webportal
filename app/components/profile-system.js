import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    traitsExtraInstalled: computed(function() {
      return this.get('game.extra_plugins').any(e => e == 'traits');
    }),
    
    actions: { 
        reloadChar() {
            this.sendAction('reloadChar');
        }
    }
});
