import Controller from '@ember/controller';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend({

  showFiles: false,
  
  resetOnExit() { 
    this.set('showFiles', false);
  },
  
  @action
  reloadChar() {
    this.send('reloadModel');
  },
        
  @action
  fileUploaded(folder, file) {
    let model_folder = this.get('model.char.name').toLowerCase();
    if (folder === model_folder) {
      pushObject(this.get('model.char.files'), { folder: folder, name: file, path: `/${folder}/${file}` }, this.model.char, 'files');
    }
  },
  
  @action
  setShowFiles(value) {
    this.set('showFiles', value);
  }   
   
});