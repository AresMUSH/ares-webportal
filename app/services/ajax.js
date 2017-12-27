import Service from '@ember/service';

export default Service.extend({
    getGame() {
        return $.getJSON("http://localhost:4203/games/1").then(
            function(response) {
                return Ember.Object.create(response);
            }
        );
    },
    
    getScenes() {
        return $.getJSON("http://localhost:4203/scenes").then(
            function(response) {
                return response.map(r => Ember.Object.create(r));
            }
        );
    },
    
    getScene(id) {
        return $.getJSON("http://localhost:4203/scene/" + id).then(
            function(response) {
                return Ember.Object.create(response);
            }
        );
    }
    
});
