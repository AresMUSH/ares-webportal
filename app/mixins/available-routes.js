import { getOwner } from '@ember/application';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
    
    availableRoutes: function() {
      let router = getOwner(this).lookup('router:main');
      let keys  = Object.keys(router.get('_routerMicrolib.recognizer.names'));
      return keys.filter(r => !r.includes('loading') && !r.includes('error'));
    }
});
