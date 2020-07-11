import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
    session: service(),
    
    isAuthenticated: computed('session.isAuthenticated', function() {
        return this.get('session.isAuthenticated');
    }),
    
    isApproved: computed('session.data.authenticated.is_approved', function() {
        return this.get('session.data.authenticated.is_approved');
    }),
    
    isAdmin: computed('session.data.authenticated.is_admin', function() {
        return this.get('session.data.authenticated.is_admin');        
    }),
    
    isCoder: computed('session.data.authenticated.is_coder', function() {
        return this.get('session.data.authenticated.is_coder');        
    }),
    
    isWikiMgr: computed('session.data.authenticated.is_wiki_mgr', function() {
        return this.get('session.data.authenticated.is_wiki_mgr');        
    }),
    
    currentUser: computed('session.data.authenticated', function() {
        return this.get('session.data.authenticated');
    })
});
