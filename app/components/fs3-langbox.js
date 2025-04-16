import Component from '@ember/component';
import { action } from '@ember/object';

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
    
  @action
  increment() {
    var current = this.rating;
    if (current < this.maxRating) {
      this.set('rating',  current + 1);
    }
    this.set('ratingName', this.getRatingName());
    this.updated();
  },
    
  @action
  decrement() {
    var current = this.rating;
    if (current > this.minRating) {
      this.set('rating',  current - 1);
    }
    this.set('ratingName', this.getRatingName());
    this.updated();
  }
});
