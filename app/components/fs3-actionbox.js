import Component from '@ember/component';

export default Component.extend({
    minRating: 0,
    maxRating: 8,
    
    getRatingName: function() {
        let name = "";
        
        switch (this.rating) {
            case 0:
                name = "Unskilled";
                break;
            case 1:
                name = "Everyman";
                break;
            case 2:
                name =  "Amateur";
                break;
            case 3:
                name =  "Fair";
                break;
            case 4:
                name =  "Good";
                break;
            case 5:
                name = "Great";
                break;
            case 6:
                name = "Expert";
                break;
            case 7:
                name = "Elite";
                break;
            case 8:
                name = "Legendary";
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
