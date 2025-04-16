import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend(AuthenticatedController, {
  showUpload: false,
    
  @action    
  uploaded(folder, file) {
    let folderFound = false;
    let fileData = { folder: folder, name: file, path: `/${folder}/file` };
    this.model.forEach(function (f) {
      if (f.name === folder) {
        pushObject(f.files, fileData, f, 'files' );
        folderFound = true;
      }
    });
           
    if (!folderFound) {
      pushObject(this.model, { name: folder, files: [ fileData ]}, this, 'model');
    }
  },
  
  @action
  toggleShowUpload() {
    this.set('showUpload', !this.showUpload);
  }
});