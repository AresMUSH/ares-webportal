import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  newPassword: '',
  currentPassword: '',
  confirmPassword: '',
  confirmPasswordHandle: '',
  confirmPasswordSettings: '',
  handleName: '',
  linkCode: '',
  backupInProgress: false,
  flashMessages: service(),
  gameApi: service(),
  cookies: service(),
    
  resetOnExit: function() {
    this.set('currentPassword', '');
    this.set('newPassword', '');
    this.set('confirmPassword', '');
    this.set('confirmPasswordHandle', '');
    this.set('confirmPasswordSettings', '');
    this.set('linkCode', '');
    this.set('handleName', '');
    // Don't reset backup in progress
  },
    
  @action
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
        
  @action
  changeSettings() {
    
    this.cookies.setEditorPreference(this.get('model.editor'));
    
    this.gameApi.requestOne('updateAccountInfo', 
    { 
      email: this.get('model.email'), 
      name: this.get('model.name'),
      alias: this.get('model.alias'),
      confirm_password: this.confirmPasswordSettings,
      timezone: this.get('model.timezone'),
      unified_play_screen: this.get('model.unified_play_screen'),
      editor: this.get('model.editor')
      
    }, null)
    .then((response) => {            
      if (response.error) {
        return;
      }            
      this.resetOnExit();    
      this.flashMessages.success("Your account settings have been changed.");
    });
  },
        
  @action
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
        
  @action
  timezoneChanged(val) {
    this.set('model.timezone', val);
  },
  
  @action
  editorChanged(val) {
    this.set('model.editor', val);
  },
  
  @action
  createBackup() {
    this.gameApi.requestOne('backupChar', { id: this.model.id }, null)
    .then((response) => {            
        if (response.error) {
          this.flashMessages.danger(response.error);
          return;
        }            
      this.set('backupInProgress', true);
    });
    
  }
        
});