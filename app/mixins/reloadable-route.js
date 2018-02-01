import Mixin from '@ember/object/mixin';

export default Mixin.create({
    actions: {
        reloadModel(whenComplete = {}) {
            this.refresh().promise.then(whenComplete);
        }        
    }
});
