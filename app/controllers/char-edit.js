import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    gameApi: service(),
    flashMessages: service(),
    genders: computed(function() {
      let list = [];
      this.get('model.cgInfo.genders').forEach(function(g) {
        list.push({ value: g });
      });
      return list;
    }),
  
    buildQueryDataForChar: function() {
        let demographics = {};
        let profile = {};
        let relationships = {};
        
        let demo_entry = this.get('model.char.demographics');
        Object.keys(demo_entry).forEach(function(k) {
            demographics[k] = demo_entry[k].value;
        });

        this.get('model.char.profile').forEach(function(p) {
            profile[p.name] = p.text;
        });
        
        this.get('model.char.relationships').forEach(function(r) {
            relationships[r.name] = { text: r.text, 
              order: r.order, 
              category: r.category,
              is_npc: r.is_npc,
              npc_image: r.is_npc ? r.npc_image : null };
        });
        
        let tags = this.get('model.char.tags') || [];
        if (!Array.isArray(tags)) {
            tags = tags.split(/[\s,]/);
        }
                
        return { 
            id: this.get('model.char.id'),
            demographics: demographics,
            rp_hooks: this.get('model.char.rp_hooks'),
            relationships: relationships,
            relationships_category_order: this.get('model.char.relationships_category_order'),
            profile: profile,
            bg_shared: this.get('model.char.bg_shared'),
            lastwill: this.get('model.char.lastwill'),
            profile_image: this.get('model.char.profile_image.name'),
            profile_icon: this.get('model.char.profile_icon.name'),
            profile_gallery: this.get('model.char.profile_gallery'),
            tags: tags
        };
    }, 
    actions: {
        addProfile() {
            let count = this.get('model.char.profile.length');
            this.get('model.char.profile').pushObject({ name: '', text: '', key: count + 1 });
        },
        addRelationship() {
            let count = this.get('model.char.relationships.length');
            this.get('model.char.relationships').pushObject({ name: '', text: '', key: count + 1 });
        },
        fileUploaded(folder, name) {
            let model_folder = this.get('model.char.name').toLowerCase();
            if (folder === model_folder) {
                if (!this.get('model.char.files').some( f => f.name == name && f.folder == model_folder )) {
                    this.get('model.char.files').pushObject( { name: name, path: `${folder}/${name}` });
                }
            }
        },
        genderChanged(val) {
            this.set('model.char.demographics.gender.value', val.value);
        },
        profileImageChanged(image) {
            this.set('model.char.profile_image', image);
        },
        profileIconChanged(icon) {
            this.set('model.char.profile_icon', icon);
        },
        removeProfile(key) {
            let profile = this.get('model.char.profile');
            profile = profile.filter(p => p.key != key);
            this.set('model.char.profile', profile);
        },
        removeRelationship(key) {
            let relationships = this.get('model.char.relationships');
            relationships = relationships.filter(p => p.key != key);
            this.set('model.char.relationships', relationships);
        },
        save() {
            if (this.get('model.char.profile').filter(p => p.name.length == 0).length > 0) {
                this.flashMessages.danger('Profile names cannot be blank.');
                return;
            }
            
            if (this.get('model.char.relationships').filter(r => r.name.length == 0).length > 0) {
                this.flashMessages.danger('Relationship names cannot be blank.');
                return;
            }
            
            let api = this.gameApi;
            api.requestOne('profileSave', this.buildQueryDataForChar(), null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
            
                this.flashMessages.success('Saved!');
                this.transitionToRoute('char', this.get('model.char.name'));
                
            });
        }
    }
});