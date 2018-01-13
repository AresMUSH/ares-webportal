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
                name = "Interest";
                break;
            case 2:
                name =  "Profession";
                break;
            case 3:
                name =  "Expertise";
                break;
        }
        return name;
    },
    
    actions: { 
        increment() {
            var current = this.get('rating');
            if (current < this.get('maxRating')) {
                this.set('rating',  current + 1);
            }
            this.set('ratingName', this.getRatingName());
            this.sendAction('updated');
        },
    
        decrement() {
            var current = this.get('rating');
            if (current > this.get('minRating')) {
                this.set('rating',  current - 1);
            }
            this.set('ratingName', this.getRatingName());
            this.sendAction('updated');
        }
    }
});
