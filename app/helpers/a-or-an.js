import { helper } from '@ember/component/helper';

export function aOrAn([word]) {
  if (!word) return 'a';
  const firstLetter = word.charAt(0).toLowerCase();
  return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
}

export default helper(aOrAn);