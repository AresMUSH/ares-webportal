import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    
    model: function(params) {
        let folder = params['folder'];
        let name = params['name'];
        let path = `${folder}/${name}`;
        
        return EmberObject.create({ path: path, folder: folder, name: name, new_folder: folder, new_name: name });
    }
});
