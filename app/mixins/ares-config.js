import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({    
    aresconfig: computed(function() {
      return window.aresconfig;
    })
});

