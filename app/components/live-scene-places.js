import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  gameApi: service(),
  flashMessages: service(),

  showPlaces: false,
  selectPlace: false,
  newPlace: null,

  @action
  changePlace() {
    let api = this.gameApi;

    // Needed because the onChange event doesn't get triggered when the list is 
    // first loaded, so the place string is empty.
    let defaultPlace = this.get('scene.places')[0] ? this.get('scene.places')[0].name : null;
    let newPlace = this.newPlace || defaultPlace;
    
    this.set('selectPlace', false);
    this.set('newPlace', null);
          
    if (!newPlace) {
      this.flashMessages.danger("You haven't selected a place.");
      return;
    }

    api.requestOne('changePlace', { scene_id: this.get('scene.id'),
    place_name: newPlace, sender: this.get('scene.poseChar.name') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
    });
  },
      
  @action
  leavePlace() {
    let api = this.gameApi;

    api.requestOne('leavePlace', { scene_id: this.get('scene.id'), sender: this.get('scene.poseChar.name') })
    .then( (response) => {
      if (response.error) {
        return;
      }
    });
  },
      
  @action
  viewPlaces() {
    let api = this.gameApi;

    api.requestOne('viewPlaces', { scene_id: this.get('scene.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('scene.places', response.places);
      this.set('showPlaces', true);
    });
  },
  
  @action
  setSelectPlace(value) {
    this.set('selectPlace', value);
  },
  
  @action
  setShowPlaces(value) {
    this.set('showPlaces', value);
  },
  
  @action
  onPlaceSelected(event) {
    this.set('newPlace', event.target.value);
  },
});