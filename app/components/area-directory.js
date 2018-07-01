import Component from '@ember/component';

export default Component.extend({
        
    actions: { 
        selectArea(area) {
            this.get('onSelected')(area.name);
        }
    }
});
