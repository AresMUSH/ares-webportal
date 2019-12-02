import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
    chars: computed('model', function() {
        let titles = this.get('model.census.titles');
        let census = this.get('model.census.chars');
        let chars = [];
        census.forEach(function(char_fields) {
            let char = [];
            titles.forEach(function(title) {
                let field = char_fields[title];
                char.push(field);
            });
            chars.push(char);
        });
        return chars;
    })
});