import { helper } from '@ember/component/helper';

export function ansiFormat(params, hash) {
    let text = `${hash.text}`;
    return ansi_up.ansi_to_html(text, { use_classes: true });
}

export default helper(ansiFormat);
