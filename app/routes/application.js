import Route from '@ember/routing/route';

export default Route.extend({
    title: function(tokens) {
      return tokens.reverse().join(' - ');
    }
 });
