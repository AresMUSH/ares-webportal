import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend({    
  flashMessages: service(),
  gameApi: service(),
  router: service(),
  charErrors: null,
  
  /* These callbacks are wired up a little weird.  
  
  In the template initialization, we connect these properties to a property in the component:
  {{fs3-chargen model=model updateCallback=fs3UpdateCallback ... }}

  Now the component's updateCallback ---binds to---> fs3UpdateCallback, which is null
   
  THEN in the component's didInsertElement method, we UPDATE updateCallback to point to a function.
  
  this.set('updateCallback', function() { return self.onUpdate(); } );
  
  Because of the binding, setting updateCallback in the component ALSO sets fs3UpdateCallback here in the controller
  
  So now fs3UpdateCallback references a function in the component that we can call to build the query data.
  */
  fs3UpdateCallback: null,
  fs3ValidateCallback: null,
  customUpdateCallback: null,
  traitsUpdateCallback: null,
  rpgUpdateCallback: null,

  init: function() {
    this._super(...arguments);
    this.set('charErrors', []);
  },
      
  genders: computed('model.cgInfo.genders', function () {
    let list = [];
    this.get('model.cgInfo.genders').forEach(function (g) {
      list.push({ value: g });
    });
    return list;
  }),

  traitsExtraInstalled: computed('model.app.game.extra_plugins', function () {
    return this.get('model.app.game.extra_plugins').some((e) => e == 'traits');
  }),

  rpgExtraInstalled: computed('model.app.game.extra_plugins', function () {
    return this.get('model.app.game.extra_plugins').some((e) => e == 'rpg');
  }),

  anyGroupMissing: computed('model.char.groups', function () {
    let groups = this.get('model.char.groups');
    let anyMissing = false;

    Object.keys(groups).forEach((g) => {
      if (!groups[g].value) {
        anyMissing = true;
      }
    });
    return anyMissing;
  }),

    
  buildQueryDataForChar: function() {
        
    let fs3 = this.fs3UpdateCallback ? this.fs3UpdateCallback() : null;
    let custom = this.customUpdateCallback ? this.customUpdateCallback() : null;
    let traits = this.traitsUpdateCallback ? this.traitsUpdateCallback() : null;
    let rpg = this.rpgUpdateCallback ? this.rpgUpdateCallback() : null;
      
    return { 
      id: this.get('model.char.id'),
      demographics: this.get('model.char.demographics'),
      groups: this.get('model.char.groups'),
      desc: this.get('model.char.desc'),
      shortdesc: this.get('model.char.shortdesc'),
      rp_hooks: this.get('model.char.rp_hooks'),
      profile_image: this.get('model.char.profile_image'),
      background: this.get('model.char.background'),
      lastwill: this.get('model.char.lastwill'),
      fs3: fs3,
      custom: custom,
      traits: traits,
      rpg: rpg
    };
  }, 
    
  @action
  genderChanged(val) {
    this.set('model.char.demographics.gender.value', val.value);
  },
        
  @action
  groupChanged(group, val) {
    if (val) {
      this.set(`model.char.groups.${group}`, val);
    } else {
      this.set(`model.char.groups.${group}.value`, '');
      this.set(`model.char.groups.${group}.desc`, '');
    }
            
  },
        
  @action
  fileUploaded(folder, name) {
    folder = folder.toLowerCase();
    name = name.toLowerCase();
    this.set('model.char.profile_image', `${folder}/${name}`);
  },
        
  @action
  review() {
    let api = this.gameApi;
    api.requestOne('chargenSave', { id: this.get('model.char.id'), char: this.buildQueryDataForChar() })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('chargen-review', this.get('model.char.id'));
    });   
  },
        
  @action
  reset() {
    let api = this.gameApi;
    api.requestOne('chargenReset', { id: this.get('model.char.id'), char: this.buildQueryDataForChar() })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
      this.flashMessages.success('Abilities reset.');
    });    
  },
        
  @action
  save() {
    let api = this.gameApi;
    api.requestOne('chargenSave', { id: this.get('model.char.id'), char: this.buildQueryDataForChar() })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.charErrors.clear();
      if (this.fs3ValidateCallback) {
        this.fs3ValidateCallback();
      }
      if (response.alerts) {
        response.alerts.forEach( r => pushObject(this.charErrors, r, this, 'charErrors') );
      }
      this.flashMessages.success('Saved!');
    }); 
  },
        
  @action
  unsubmit() {
    let api = this.gameApi;
    api.requestOne('chargenUnsubmit')
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.send('reloadModel');
    }); 
  }
});