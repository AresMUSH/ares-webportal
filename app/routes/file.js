import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    
    model: function(params) {
        let folder = params['folder'];
        let name = params['name'];
        let path = `${folder}/${name}`;
        
        return Ember.Object.create({ path: path, folder: folder, name: name });
    }
});
