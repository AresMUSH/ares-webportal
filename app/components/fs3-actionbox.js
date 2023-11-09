import Component from '@ember/component';

export default Component.extend({
    minRating: 0,
    maxRating: 8,
  
    
    getRatingName: function() {
        let name = "";
        
        switch (this.rating) {
            case 0:
                name = "Untrained";
                break;
            case 1:
                name = "Average";
                break;
            case 2:
                name =  "Trained";
                break;
            case 3:
                name =  "Exceptional";
                break;
            case 4:
                name =  "Legendary";
                break;
            case 5:
                name = "Great";
                break;
            case 6:
                name = "Exceptional";
                break;
            case 7:
                name = "Amazing";
                break;
            case 8:
                name = "Legendary";
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
            this.updated();
        },
    
        decrement() {
            var current = this.rating;
            if (current > this.minRating) {
                this.set('rating',  current - 1);
            }
            this.set('ratingName', this.getRatingName());
            this.updated();
        }
    }
});
