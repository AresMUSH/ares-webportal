import Route from '@ember/routing/route';

export default Route.extend({
    
    model: function(params) {
        let folder = params['folder'];
        let name = params['name'];
        let path = `${folder}/${name}`;
        
        return Ember.Object.create({ path: path, folder: folder, name: name });
    },
    titleToken: function(model) {
        return model.name;
    }
});
