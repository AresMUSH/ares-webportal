import { helper } from '@ember/component/helper';

export function ansiFormat(params, hash) {
  return ansi_up.ansi_to_html(hash.text, { use_classes: true });
}

export default helper(ansiFormat);
