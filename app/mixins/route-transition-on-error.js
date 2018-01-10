import Mixin from '@ember/object/mixin';

export default Mixin.create({
    errorRoute: 'home',
    
    afterModel: function(model) {
        if (model && model.error) {
            this.transitionTo(this.get('errorRoute'));
        }
    },
});
