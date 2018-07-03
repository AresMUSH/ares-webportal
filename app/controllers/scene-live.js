import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    favicon: service(),
    
    showLocationSelect: false,
    scenePose: '',
    onSceneActivity: function(msg) {
        let splitMsg = msg.split('|');
        let sceneId = splitMsg[0];

        if (sceneId === this.get('model.id')) {
            this.get('gameApi').requestOne('liveScene', { id: this.get('model.id') }).then( response => {
                this.set(`model`, response)
                this.get('gameSocket').notify('New scene activity!');
                 this.scrollSceneWindow();
            });
        }
    },
    
    pageTitle: function() {
        return 'Scene ' + this.get('model.id');
    }.property(),
    
    resetOnExit: function() {
        this.set('scenePose', '');
        this.set('newActivity', false);
    },
    
    setupCallback: function() {
        let self = this;
        
        this.get('gameSocket').set('sceneCallback', function(data) {
            self.onSceneActivity(data) } );
    },
    
    scrollSceneWindow: function() {
        $('#live-scene-log').stop().animate({
            scrollTop: $('#live-scene-log')[0].scrollHeight
        }, 800);    
    },
    
    actions: {
        
        addPose(poseType) {
            let pose = this.get('scenePose');
            if (pose.length === 0) {
                this.get('flashMessages').danger("You haven't entered antyhing.");
                return;
            }
            let api = this.get('gameApi');
            api.requestOne('addScenePose', { id: this.get('model.id'),
                pose: pose, pose_type: poseType })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.scrollSceneWindow();
            });
            this.resetOnExit();
        },
        
        changeSceneStatus(status) {
            let api = this.get('gameApi');
            api.requestOne('changeSceneStatus', { id: this.get('model.id'),
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