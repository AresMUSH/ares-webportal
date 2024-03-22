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

    },
    mageSpellsChanged(new_spells) {
      this.set('char.custom.mage_starting_spells', new_spells);

    },
    mythicSpellsChanged(new_spells) {
      this.set('char.custom.mythic_starting_spells', new_spells);

    },
    mounttypeChanged(type) {
      this.set('char.custom.mount_type', type);

    },
    mountGenderChanged(type) {
      this.set('char.custom.mount_gender', type);
    },
    lorehookPrefChanged(val) {
      this.set('char.custom.lore_hook_pref', val);
    }
  },

  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    //
    // return { goals: this.get('char.custom.goals') };
    return {
      major_school: this.get('char.custom.major_school'),
      minor_school: this.get('char.custom.minor_school'),
      mage_starting_spells: this.get('char.custom.mage_starting_spells'),
      mythic_starting_spells: this.get('char.custom.mythic_starting_spells'),
      mount_type: this.get('char.custom.mount_type'),
      mount_name: this.get('char.custom.mount_name'),
      mount_gender: this.get('char.custom.mount_gender'),
      mount_shortdesc: this.get('char.custom.mount_shortdesc'),
      mount_desc: this.get('char.custom.mount_desc'),
      lore_hook_pref: this.get('char.custom.lore_hook_pref')
    };
  }
});
