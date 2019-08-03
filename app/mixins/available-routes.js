import { getOwner } from '@ember/application';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
    
    availableRoutes: function() {
      let router = getOwner(this).lookup('router:main');
      let keys  = Object.keys(router.get('_routerMicrolib.recognizer.names'));
      return keys.filter(r => !r.includes('loading') && !r.includes('error'));
    },
    
    routeHasId: function(name) {
      let router = getOwner(this).lookup('router:main');
      let segments = router.get(`_routerMicrolib.recognizer.names.${name}.segments`);
      if (segments.length < 3) {
        return false;
      }
      return segments[2].type == 1;
    }
});
