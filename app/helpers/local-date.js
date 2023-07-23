import dayjs from 'dayjs';
import { helper } from '@ember/component/helper';

export function localDate(params, hash) {
  let date = params[0];
  let format = params[1];
  return dayjs(date).format(format);
}

export default helper(localDate);
