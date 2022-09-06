import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';

export function timeDiff(params, hash) {
    let time = `${hash.time}`;
    let original = dayjs(time);
    let diff = 0 - original.diff(dayjs(), 'minutes');
    
    if (diff > 60*24) {
      return `${Math.round(diff / (60 * 24))}d`;
    }
    else if (diff > 60) {
      return `${Math.round(diff / 60)}h`;
    } else {
      return `${diff}m`;      
    }
}

export default helper(timeDiff);
