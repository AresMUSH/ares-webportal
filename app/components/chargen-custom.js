import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  
  didInsertElement: function() {
    this._super(...arguments);
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },

  actions: {
    majorschoolChanged(new_school) {
      this.set('char.custom.major_school', new_school);
        
    },
    minorschoolChanged(new_school) {
      this.set('char.custom.minor_school', new_school);
        
    }
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
    return {
      major_school: this.get('char.custom.major_school'),
      minor_school: this.get('char.custom.minor_school')
    };
  }
});
