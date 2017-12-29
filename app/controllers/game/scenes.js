import Controller from '@ember/controller';

export default Controller.extend({
    page: 1,
    per_page: 30,
    filter: 'Recent',
    
    filtered_scenes: function() {
        let types = this.get('model.scene_types').map(t => t.get('name'));
        let selected_filter = this.get('filter');
        
        if (types.includes(selected_filter)) {
            return this.get('model.scenes').filter(s => s.scene_type == selected_filter.toLowerCase());
        } 
        else if (selected_filter === 'All' ){
            return this.get('model.scenes');
        } 
        else if (selected_filter === 'Recent') { 
            return this.get('model.scenes').slice(0, 20);
        } 
        else {
            var re = new RegExp(this.get('filter'),"i");
            return this.get('model.scenes').filter(s => s.title.match(re));
        }        
    }.property('model', 'filter'),
    
    num_scenes: function() {
        return this.get('filtered_scenes').length;
    }.property('model', 'filter', 'page'),
    
    num_pages: function() {
        let fraction = this.get('num_scenes') / this.get('per_page');
        return Math.ceil(fraction);
    }.property('num_scenes'),
    
    page_scenes: function() {
        let current_page = this.get('page');
        if (!current_page || current_page < 0 || current_page > this.get('num_pages')) {
            current_page = 1;
        }
        let per_page = this.get('per_page');
        let start = (current_page - 1) * per_page;
        let available = this.get('filtered_scenes');
        let selected = available.slice(start, start + per_page);
        return selected;
        
    }.property('model', 'filter', 'page'),
    
    pages_list: function() {
        let pages = [];
        for (var i = 0; i < this.get('num_pages'); i++) {
            pages.push(i + 1);
        }
        return pages;
    }.property('model', 'filter', 'page'),
    
    scene_filters: function() {
        let types = this.get('model.scene_types');
        let scene_types = types.map(s => s.name);
        return ['Recent', 'All'].concat(scene_types);
    }.property('model'),
    
    actions: {
        filter_changed(new_filter) {
            this.set('filter', new_filter);
        },
        goto_page(new_page) { 
            this.set('page', new_page);
        },
        search_scenes(search_term) {
            this.set('filter', search_term);
        }
    }
});