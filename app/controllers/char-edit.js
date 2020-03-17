import Controller from '@ember/controller';
import { computed } from '@ember/object';
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
            tags: tags,
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