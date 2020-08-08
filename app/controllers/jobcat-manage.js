import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    categoryToDelete: null,
  
    actions: {
        deleteCategory: function() {
          let api = this.gameApi;
          let id =  this.get('categoryToDelete.id');
          this.set('categoryToDelete', null);
          api.requestOne('jobCategoryDelete', { id: id }, null)
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