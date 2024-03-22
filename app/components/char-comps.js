import Component from '@ember/component';

export default Component.extend({
    compFilters: function() {
        let base_filters = ['Recent', 'All'];
        return base_filters;
    }.property('comps'),

    actions: {
        filterChanged(newFilter) {
          this.sendAction('filterChanged', newFilter);
        },
        goToPage(newPage) {
          this.sendAction('goToPage', newPage);
        }
    }

});
