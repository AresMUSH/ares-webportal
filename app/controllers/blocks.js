import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(ConfirmAction, {
  flashMessages: service(),
  gameApi: service(),  
    
  blockChar: null,
  blockType: null,
    
  resetOnExit: function() {
    this.set('blockChar', null);
    this.set('blockType', null);
    this.hideActionConfirmation();    
  },
    
  @action
  blockCharChanged(char) {
    this.set('blockChar', char);
  },
  
  @action
  blockTypeChanged(type) {
    this.set('blockType', type);
  },
       
  @action 
  removeBlock(id) {
    let api = this.gameApi;
    
    api.requestOne('removeBlock', { id: id }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      
      this.send('reloadModel');
      this.flashMessages.success('Block removed.');
    });
  },
  
  @action
  addBlock() {
    let api = this.gameApi;
            
    if (!this.blockChar || !this.blockType) {
      this.flashMessages.danger("Must select a character and block type.");
      return;
    }
    
    api.requestOne('addBlock', 
    { 
      name: this.blockChar.name, 
      block_type: this.blockType
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.hideActionConfirmation();      
      this.send('reloadModel');
      this.flashMessages.success('Blocked.');
    });
  }
});