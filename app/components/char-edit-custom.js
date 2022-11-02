import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  didInsertElement: function() {
    this._super(...arguments);
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },

  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    //
    // return { goals: this.get('char.custom.goals') };
    return {
      mythic_name: this.get('char.custom.mythic_name'),
      mythic_about: this.get('char.custom.mythic_about'),
      mythic_desc: this.get('char.custom.mythic_desc'),
      mythic_shortdesc: this.get('char.custom.mythic_shortdesc'),
    };
  }
});
