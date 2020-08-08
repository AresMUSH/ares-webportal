import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    forumToDelete: null,
  
    actions: {
        deleteForum: function() {
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
        }
    }
    
});