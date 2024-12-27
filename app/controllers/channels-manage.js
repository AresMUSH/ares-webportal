import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  channelToDelete: null,
  
  confirmDeleteChannel: computed('channelToDelete', function() {
    return this.channelToDelete != null;
  }),
  
  @action
  deleteChannel() {
    let api = this.gameApi;
    let id =  this.get('channelToDelete.id');
    this.set('channelToDelete', null);
    api.requestOne('deleteChannel', { id: id }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Channel Deleted!');
    });
  },
  
  @action
  setChannelToDelete(value) {
    this.set('channelToDelete', value);
  }    
});