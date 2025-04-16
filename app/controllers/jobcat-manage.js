import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  categoryToDelete: null,
  flashMessages: service(),
  
  confirmDeleteCategory: computed('categoryToDelete', function() {
    return this.categoryToDelete != null;
  }),  
    
  @action
  deleteCategory() {
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
  },
  
  @action
  setCategoryToDelete(value) {
    this.set('categoryToDelete', value);
  }    
});