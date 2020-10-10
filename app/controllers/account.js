import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    newPassword: '',
    currentPassword: '',
    confirmPassword: '',
    confirmPasswordHandle: '',
    confirmPasswordSettings: '',
    handleName: '',
    linkCode: '',
    session: service(),
    flashMessages: service(),
    gameApi: service(),
    
    resetOnExit: function() {
      this.set('currentPassword', '');
      this.set('newPassword', '');
      this.set('confirmPassword', '');
      this.set('confirmPasswordHandle', '');
      this.set('confirmPasswordSettings', '');
      this.set('linkCode', '');
      this.set('handleName', '');
    },
    actions: {
        
        changePassword() {
            
           this.gameApi.requestOne('changePassword', 
               { name: this.get('model.name'), current_password: this.currentPassword, confirm_password: this.confirmPassword, new_password: this.newPassword}, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.resetOnExit();    
                this.flashMessages.success("Your password has been changed.");
            });
        },
        
        changeSettings() {
            
           this.gameApi.requestOne('updateAccountInfo', 
               { email: this.get('model.email'), 
                 name: this.get('model.name'),
                 confirm_password: this.confirmPasswordSettings,
                 timezone: this.get('model.timezone')
               }, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.resetOnExit();    
                this.flashMessages.success("Your account settings have been changed.");
            });
        },
        
        linkHandle() {
            
           this.gameApi.requestOne('linkHandle', 
               { handle_name: this.handleName, link_code: this.linkCode, confirm_password: this.confirmPasswordHandle }, null)
            .then((response) => {            
                if (response.error) {
                    return;
                }            
                this.set('model.handle', response.handle);
                this.resetOnExit();    
                this.flashMessages.success("You have linked this character to your Ares player handle.");
            });
        },
        
        timezoneChanged(val) {
          this.set('model.timezone', val);
        }
        
        
    }
});