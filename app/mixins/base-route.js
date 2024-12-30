import Mixin from '@ember/object/mixin';
import { action } from '@ember/object';

export default Mixin.create({
    
    resetController: function(controller, isExiting) {
      this._super.apply(this, arguments);

      if (isExiting) {
        if (controller.resetOnExit) {
          controller.resetOnExit();
        }          
      }
    },
    
    @action
    reloadModel() {
      this.refresh();
    }
});
