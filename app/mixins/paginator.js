import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
    page: 1,
    perPage: 30,
    
    currentPageItems: computed('allItems', 'page', function() {
        let current_page = this.page;
        if (!current_page || current_page < 0 || current_page > this.numPages) {
            current_page = 1;
        }
        let per_page = this.perPage;
        let start = (current_page - 1) * per_page;
        let selected = this.allItems.slice(start, start + per_page);
        return selected;
    }),
    
    pagesList: computed('allItems', 'page', function() { 
        let pages = [];
        for (var i = 0; i < this.numPages(); i++) {
            pages.push(i + 1);
        }
        return pages;
    }),
    
    numPages: function() {
        let fraction = this.allItems.length / this.perPage;
        return Math.ceil(fraction);
    }
});
