import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    showUpload: false,
    
    actions: {        
        uploaded: function(folder, file) {
          let folderFound = false;
          let fileData = { folder: folder, name: file, path: `/${folder}/file` };
            this.model.forEach(function (f) {
              if (f.name === folder) {
                f.files.pushObject( fileData );
                folderFound = true;
              }
           });
           
           if (!folderFound) {
             this.model.pushObject( { name: folder, files: [ fileData ]});
           }
        }
    }
});