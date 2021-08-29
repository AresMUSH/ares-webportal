import dayjs from 'dayjs';
import { helper } from '@ember/component/helper';

export function localTime(time) {
//    return dayjs.utc(time).local().format('hh:mm A');
return dayjs(time).format('hh:mm A');
}

export default helper(localTime);
