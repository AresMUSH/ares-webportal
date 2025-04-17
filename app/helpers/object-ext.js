import dayjs from 'dayjs';
import { helper } from '@ember/component/helper';
import { notifyPropertyChange } from '@ember/object';

export function pushObject(list, item, objectToNotify = null, propertyToNotify = null) {
  if (!list) return;
  list.push(item);
  if (objectToNotify && propertyToNotify) {
    notifyPropertyChange(objectToNotify, propertyToNotify);
  }
}


export function removeObject(list, item, objectToNotify = null, propertyToNotify = null) {
  if (!list) return;
  let index = list.indexOf(item);
  if (index < 0) return;
  list.splice(index, 1);
  
  if (objectToNotify && propertyToNotify) {
    notifyPropertyChange(objectToNotify, propertyToNotify);
  }
}

export function clearList(list, objectToNotify = null, propertyToNotify = null) {
  if (!list) return;
  list.length = 0;
  
  if (objectToNotify && propertyToNotify) {
    notifyPropertyChange(objectToNotify, propertyToNotify);
  }
}

export default helper(pushObject);
