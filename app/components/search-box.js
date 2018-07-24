import Component from '@ember/component';
import Paginator from 'ares-webportal/mixins/paginator';
import { inject as service } from '@ember/service';

export default Component.extend(Paginator, {
    searchTerm: '',
    router: service(),
    
    actions: {
        search: function() {
            let term = this.get('searchTerm');
            this.set('searchTerm', '');
            this.get('router').transitionTo('search', { queryParams: { term: term } } );
        }
    }

});
