import Mixin from '@ember/object/mixin';

export default Mixin.create({
    actions: {
        reloadModel() {
            this.refresh();
        }        
    }
});
