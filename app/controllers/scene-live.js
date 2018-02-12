import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    flashMessages: service(),
    notifications: service(),
    newActivity: false,
    scenePose: '',
    onSceneActivity: function(sceneId) {
        if (sceneId === this.get('model.id')) {
            this.get('notifications').changeFavicon(true);                    
            this.set('newActivity', true);
            this.get('notifications').notify("New scene activity!");
        }
    },
    
    resetOnExit: function() {
        this.set('scenePose', '');
        this.set('newActivity', false);
        this.get('notifications').changeFavicon(false);                    
    },
    
    setupCallback: function() {
        let self = this;
        this.get('notifications').set('sceneCallback', function(scene) {
            self.onSceneActivity(scene) } );
    },
    
    actions: {
        
        addPose(poseType) {
            let pose = this.get('scenePose');
            if (pose.length === 0) {
                this.get('flashMessages').danger("You haven't entered a pose.");
                return;
            }
            let aj = this.get('ajax');
            aj.requestOne('addScenePose', { id: this.get('model.id'),
                pose: pose, pose_type: poseType })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.resetOnExit();
                this.send('reloadModel');
            });
        },
        
        changeSceneStatus(status) {
            let aj = this.get('ajax');
            aj.requestOne('changeSceneStatus', { id: this.get('model.id'),
                status: status }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (status === 'share') {
                    this.get('flashMessages').success('The scene has been shared.');
                    this.transitionToRoute('scene', this.get('model.id'));
                }
                else if (status === 'stop') {
                    this.get('flashMessages').success('The scene has been stopped.');
                    this.resetOnExit();
                    this.send('reloadModel');
                }
                else if (status === 'restart') {
                    this.get('flashMessages').success('The scene has been restarted.');
                    this.resetOnExit();
                    this.send('reloadModel'); 
                }
            });
        },
        
        refresh() {
            this.resetOnExit();
            this.send('reloadModel');
        }
    }
});