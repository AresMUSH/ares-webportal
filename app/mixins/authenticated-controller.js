import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
    session: service(),
    
    isAuthenticated: function() {
        return this.get('session.isAuthenticated');
    }.property('session.isAuthenticated'),
    
    isApproved: function() {
        return this.get('session.data.authenticated.is_approved');
    }.property('model'),
    
    isAdmin: function() {
        return this.get('session.data.authenticated.is_admin');        
    }.property('model'),
    
    isCoder: function() {
        return this.get('session.data.authenticated.is_coder');        
    }.property('model'),
    
    currentUser: function() {
        return this.get('session.data.authenticated');
    }.property('model')
});
