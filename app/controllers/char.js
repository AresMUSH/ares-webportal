import Controller from '@ember/controller';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

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
      this.get('model.char.files').push( { folder: folder, name: file, path: `/${folder}/${file}` } );
      notifyPropertyChange(this, 'model');          
    }
  },
  
  @action
  setShowFiles(value) {
    this.set('showFiles', value);
  }   
   
});