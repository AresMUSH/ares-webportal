import { helper } from '@ember/component/helper';

export function timeDiff(params, hash) {
    let time = `${hash.time}`;
    let original = moment(time);
    let diff = 0 - original.diff(moment(), 'minutes');
    
    if (diff > 60) {
      return `${Math.round(diff / 60)}h`;
    } else {
      return `${diff}m`;      
    }
}

export default helper(timeDiff);
