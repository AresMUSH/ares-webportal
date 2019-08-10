import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  
    dots: function() {
      let rating = this.rating;
      let max = this.max;
      return (new Array(max)).fill({}).map(function (fill, i) { return { fill: i+1 <= rating }; });
    }.property('rating')
});
