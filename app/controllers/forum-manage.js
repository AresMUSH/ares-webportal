import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  forumToDelete: null,
    
  confirmDeleteForum: computed('forumToDelete', function() {
    return this.forumToDelete != null;
  }),  
    
  resetOnExit: function() {
    this.set('forumToDelete', null);
  },
  
  @action
  deleteForum() {
    let api = this.gameApi;
    let id =  this.get('forumToDelete.id');
    this.set('forumToDelete', null);
    api.requestOne('deleteForum', { id: id }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Category Deleted!');
    });
  },
  
  @action
  setForumToDelete(value) {
    this.set('forumToDelete', value);
  }    
});