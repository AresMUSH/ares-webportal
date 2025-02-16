import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  gameApi: service(),
  flashMessages: service(),
  
  @action
  rolesChanged(roles) {
    this.set('char.roles', roles);
  },
      
  @action
  resetPassword(roles) {
    let api = this.gameApi;
    api.requestOne('resetPassword', { id: this.char.id }, null)
    .then( (response) => {
        if (response.error) {
            return;
        }
    
        const newPassword = response['new_password'];
        this.flashMessages.success(`Password reset to: ${newPassword}!`);
    });
  },
      
});
