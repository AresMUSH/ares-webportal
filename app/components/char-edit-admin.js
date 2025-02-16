import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  gameApi: service(),
  newPassword: '',
  
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
    
        const newPass = response['new_password'];
        this.set('newPassword', newPass);
    });
  },
      
});
