import { helper } from '@ember/component/helper';

export function handlebarsLog(params) {
  console.log(...params);
}

export default helper(handlebarsLog);