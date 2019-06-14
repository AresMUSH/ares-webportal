import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    newPassword: '',
    currentPassword: '',
    confirmPassword: '',
    handleName: '',
    linkCode: '',
    session: service(),
    flashMessages: service(),
    gameApi: service(),
    
    resetOnExit: function() {
      this.set('currentPassword', '');
      this.set('newPassword', '');
      this.set('confirmPassword', '');
      this.set('linkCode', '');
      this.set('handleName', '');
    },
    actions: {
        
        changePassword() {
            
           this.get('gameApi').requestOne('changePassword', 
               { name: this.get('currentUser.name'), current_password: this.get('currentPassword'), confirm_password: this.get('confirmPassword'), new_password: this.get('newPassword')}, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.resetOnExit();    
                this.get('flashMessages').success("Your password has been changed.");
            });
        },
        
        linkHandle() {
            
           this.get('gameApi').requestOne('linkHandle', 
               { handle_name: this.get('handleName'), link_code: this.get('linkCode') }, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.set('model.handle', response.handle);
                this.resetOnExit();    
                this.get('flashMessages').success("You have linked this character to your Ares player handle.");
            });
        }
    }
});