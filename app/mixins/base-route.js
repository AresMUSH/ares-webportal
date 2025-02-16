import Mixin from '@ember/object/mixin';
import { action } from '@ember/object';


/* ROUTE HIERARCHY:

    BaseRoute - parent for all
      - DefaultRoute  (basic, authentication not required)
      - AuthenticatedRoute (authentication required)
      - RestrictedRoute (is_admin or is_coder privs required)
      - UnauthenticatedRoute (cannot be authenticated - i.g., login or register)
*/

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
