import Component from '@ember/component';
import Paginator from 'ares-webportal/mixins/paginator';

export default Component.extend(Paginator, {
    filter: 'Recent',
    
    allItems: function() {
        return this.get('filteredScenes');
    }.property('filteredScenes'),
    
    filteredScenes: function() {
        let types = this.get('sceneTypes').map(t => t.get('name'));
        let selected_filter = this.get('filter');
        let all_scenes = this.get('scenes');
        
        if (types.includes(selected_filter)) {
            return all_scenes.filter(s => s.scene_type == selected_filter);
        } 
        else if (selected_filter === 'All' ){
            return all_scenes;
        } 
        else if (selected_filter === 'Recent') { 
            return all_scenes.slice(0, 20);
        } 
        else if (selected_filter === 'Popular') {
            let popular = all_scenes.filter(s => s.likes > 0);
            return popular.sort((a, b) => a.likes < b.likes ).slice(0, 20);
        }
        else {
            let filter = this.get('filter');
            let re = new RegExp(filter,"i");
            return all_scenes.filter(s => s.title.match(re) || s.participants.map(p => p.name).join(' ').match(re));
        }        
    }.property('scenes', 'filter'),
    
    sceneFilters: function() {
        let types = this.get('sceneTypes');
        let scene_types = types.map(s => s.name);
        let base_filters = ['Recent', 'All', 'Popular'];
        return base_filters.concat(scene_types);
    }.property('scenes'),
    
    actions: {
        filterChanged(new_filter) {
            this.set('page', 1);
            this.set('filter', new_filter);
        },
        gotoPage(new_page) { 
            this.set('page', new_page);
        },
        searchScenes(search_term) {
            this.set('page', 1);
            this.set('filter', search_term);
        }
    }

});
