import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    gameApi: service(),
    flashMessages: service(),
    customUpdateCallback: null,
  
    buildQueryDataForChar: function() {
      
        let custom = this.customUpdateCallback ? this.customUpdateCallback() : null;
      
        let demographics = {};
        let profile = {};
        let relationships = {};
        let descs = {};
        
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

        
        descs['current'] = this.get('model.char.descs.current');
        descs['outfits'] = {};
        descs['details'] = {};
        this.get('model.char.descs.outfits').forEach(function(p) {
            descs['outfits'][p.name] = p.desc;
        });
        this.get('model.char.descs.details').forEach(function(p) {
            descs['details'][p.name] = p.desc;
        });
                        
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
            tags: tags,
            descs: descs,
            custom: custom
        };
    }, 
    actions: {
        
        save() {
            if (this.get('model.char.profile').filter(p => p.name.length == 0).length > 0) {
                this.flashMessages.danger('Profile names cannot be blank.');
                return;
            }
            
            if (this.get('model.char.relationships').filter(r => r.name.length == 0).length > 0) {
                this.flashMessages.danger('Relationship names cannot be blank.');
                return;
            }
            
            if (this.get('model.char.descs.outfits').filter(r => r.name.length == 0).length > 0) {
                this.flashMessages.danger('Outfit names cannot be blank.');
                return;
            }
            
            if (this.get('model.char.descs.outfits').filter(r => r.name.includes(' ')).length > 0) {
                this.flashMessages.danger('Outfit names cannot contain spaces.');
                return;
            }

            if (this.get('model.char.descs.details').filter(r => r.name.length == 0).length > 0) {
                this.flashMessages.danger('Detail names cannot be blank.');
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