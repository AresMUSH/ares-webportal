import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    notifications: service(),
    newActivity: false,
    onSceneActivity: function() {
        this.set('newActivity', true);
    },
    
    resetOnExit: function() {
        this.set('newActivity', false);
    },
    
    setupCallback: function() {
        let self = this;
        this.get('notifications').set('sceneCallback', function(scene) {
            self.onSceneActivity(scene) } );
    },
    
    actions: {
        
        refresh() {
            this.set('newActivity', false);
            this.send('reloadModel');
        }
    }
});