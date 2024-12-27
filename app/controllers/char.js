import Controller from '@ember/controller';
import { action } from '@ember/object';

export default Controller.extend({

  showFiles: false,
  
  @action
  reloadChar() {
    this.send('reloadModel');
  },
        
  @action
  fileUploaded(folder, file) {
    let model_folder = this.get('model.char.name').toLowerCase();
    if (folder === model_folder) {
      this.get('model.char.files').pushObject( { folder: folder, name: file, path: `/${folder}/${file}` } );
    }
  },
  
  @action
  setShowFiles(value) {
    this.set('showFiles', value);
  }   
   
});