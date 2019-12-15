import Component from '@ember/component';

export default Component.extend({
    minRating: 0,
    maxRating: 3,
    
    getRatingName: function() {
        let name = "";
        
        switch (this.rating) {
            case 0:
                name = "Everyman";
                break;
            case 1:
                name = "Beginner";
                break;
            case 2:
                name =  "Conversational";
                break;
            case 3:
                name =  "Fluent";
                break;
        }
        return name;
    },
    
    actions: { 
        increment() {
            var current = this.rating;
            if (current < this.maxRating) {
                this.set('rating',  current + 1);
            }
            this.set('ratingName', this.getRatingName());
            this.sendAction('updated');
        },
    
        decrement() {
            var current = this.rating;
            if (current > this.minRating) {
                this.set('rating',  current - 1);
            }
            this.set('ratingName', this.getRatingName());
            this.sendAction('updated');
        }
    }
});
