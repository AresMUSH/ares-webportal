import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';


export default Component.extend({
    compFilters: function() {
        let base_filters = ['Recent', 'All'];
        return base_filters;
    }.computed('comps'),

    actions: {
        filterChanged(newFilter) {
          this.sendAction('filterChanged', newFilter);
        },
        goToPage(newPage) {
          this.sendAction('goToPage', newPage);
        }
    }

});
