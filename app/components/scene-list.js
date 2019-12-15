import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    sceneFilters: computed('scenes', function() {
        let types = this.sceneTypes;
        let scene_types = types.map(s => s.name);
        let base_filters = ['Recent', 'All', 'Popular'];
        return base_filters.concat(scene_types);
    }),
    
    actions: {
        filterChanged(newFilter) {
          this.sendAction('filterChanged', newFilter);
        },
        goToPage(newPage) { 
          this.sendAction('goToPage', newPage);
        }
    }

});
