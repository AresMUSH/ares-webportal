import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    chars: function() {
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
        console.log(chars);
        return chars;
    }.property('model')
});