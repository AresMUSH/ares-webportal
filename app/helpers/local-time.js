import { helper } from '@ember/component/helper';

export function localTime(time) {
    return moment.utc(time).local().format('hh:mm A');
}

export default helper(localTime);
