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
            
           this.gameApi.requestOne('changePassword', 
               { name: this.get('currentUser.name'), current_password: this.currentPassword, confirm_password: this.confirmPassword, new_password: this.newPassword}, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.resetOnExit();    
                this.flashMessages.success("Your password has been changed.");
            });
        },
        
        linkHandle() {
            
           this.gameApi.requestOne('linkHandle', 
               { handle_name: this.handleName, link_code: this.linkCode }, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.set('model.handle', response.handle);
                this.resetOnExit();    
                this.flashMessages.success("You have linked this character to your Ares player handle.");
            });
        }
    }
});