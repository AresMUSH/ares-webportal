import Mixin from '@ember/object/mixin';

export default Mixin.create({
    
    resetController: function(controller, isExiting) {
      this._super.apply(this, arguments);

      if (isExiting) {
          controller.resetOnExit();
      }
    }
});
