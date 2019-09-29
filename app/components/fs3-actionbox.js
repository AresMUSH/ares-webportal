import Component from '@ember/component';

export default Component.extend({
    minRating: 0,
    maxRating: 5,
  
    
      
    getRatingName: function() {
        let name = "";
        
        switch (this.rating) {
            case 1:
                name = "Poor";
                break;
            case 2:
                name = "Average";
                break;
            case 3:
                name =  "Good";
                break;
            case 4:
                name =  "Exceptional";
                break;
            case 5:
                name =  "Amazing";
                break;				
        }
        return name;
    },,
    
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
