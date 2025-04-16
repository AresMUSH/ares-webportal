import { computed } from '@ember/object';
import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  sceneFilters: computed('sceneTypes', 'scenes', function () {
    let types = this.sceneTypes;
    let scene_types = types.map((s) => s.name);
    let base_filters = ['Recent', 'All', 'Popular'];
    return base_filters.concat(scene_types);
  }),

  @action
  filterChanged(newFilter) {
    this.onFilterChanged(newFilter);
  },
    
  @action
  goToPage(newPage) {
    this.onGoToPage(newPage);
  },
});
