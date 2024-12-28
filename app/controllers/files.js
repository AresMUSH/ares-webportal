import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  showUpload: false,
    
  @action    
  uploaded(folder, file) {
    let folderFound = false;
    let fileData = { folder: folder, name: file, path: `/${folder}/file` };
    this.model.forEach(function (f) {
      if (f.name === folder) {
        f.files.push( fileData );
        folderFound = true;
      }
    });
           
    if (!folderFound) {
      this.model.push( { name: folder, files: [ fileData ]});
    }
    notifyPropertyChange(this, 'model');    
  },
  
  @action
  toggleShowUpload() {
    this.set('showUpload', !this.showUpload);
  }
});