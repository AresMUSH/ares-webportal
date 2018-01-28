import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    ajax: service(),
    flashMessages: service(),
    
    buildQueryDataForChar: function() {
        let demographics = {};
        let profile = {};
        let relationships = {};
        
        let demo_entry = this.get('model.demographics');
        Object.keys(demo_entry).forEach(function(k) {
            demographics[k] = demo_entry[k].value;
        });

        this.get('model.profile').forEach(function(p) {
            profile[p.name] = p.text;
        });
        
        this.get('model.relationships').forEach(function(r) {
            relationships[r.name] = { text: r.text, order: r.order, category: r.category };
        });
        
        let tags = this.get('model.tags') || [];
        if (!Array.isArray(tags)) {
            tags = tags.split(/[\s,]/);
        }
        
        let gallery = this.get('model.gallery').map(g => g.path);
        
        let folder = this.get('model.name');
        let profile_image = this.get('model.profile_image.name');
        if (profile_image && profile_image.length > 0) {
            profile_image = `${folder}/${profile_image}`;
        }
        
        let profile_icon = this.get('model.profile_icon.name');
        if (profile_icon && profile_icon.length > 0) {
            profile_icon = `${folder}/${profile_icon}`;
        }
        
        return { 
            id: this.get('model.id'),
            demographics: demographics,
            rp_hooks: this.get('model.rp_hooks'),
            relationships: relationships,
            gallery: gallery,
            profile: profile,
            bg_shared: this.get('model.bg_shared'),
            profile_image: profile_image,
            profile_icon: profile_icon,
            tags: tags
        };
    }, 
    actions: {
        addProfile() {
            let count = this.get('model.profile.length');
            this.get('model.profile').pushObject({ name: null, text: '', key: count + 1 });
        },
        addRelationship() {
            let count = this.get('model.relationships.length');
            this.get('model.relationships').pushObject({ name: null, text: '', key: count + 1 });
        },
        fileUploaded(folder, name) {
            if (folder === this.get('model.name').toLowerCase()) {
                this.model.files.pushObject( { name: name, path: `${folder}/${name}` })
            }
        },
        galleryChanged(files) {
            this.set('model.gallery', files);
        },
        profileImageChanged(image) {
            this.set('model.profile_image', image);
        },
        profileIconChanged(icon) {
            this.set('model.profile_icon', icon);
        },
        removeProfile(key) {
            let profile = this.get('model.profile');
            profile = profile.filter(p => p.key != key);
            this.set('model.profile', profile);
        },
        removeRelationship(key) {
            let relationships = this.get('model.relationships');
            relationships = relationships.filter(p => p.key != key);
            this.set('model.relationships', relationships);
        },
        save() {
            if (this.get('model.profile').filter(p => p.name.length == 0).length > 0) {
                this.get('flashMessages').danger('Profile names cannot be blank.');
                return;
            }
            
            if (this.get('model.relationships').filter(r => r.name.length == 0).length > 0) {
                this.get('flashMessages').danger('Relationship names cannot be blank.');
                return;
            }
            
            let aj = this.get('ajax');
            aj.requestOne('profileSave', this.buildQueryDataForChar(), null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
            
                this.get('flashMessages').success('Saved!');
            });
        }
    }
});