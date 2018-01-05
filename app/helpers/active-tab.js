import { helper } from '@ember/component/helper';

export function activeTab(params, hash) {
    let index = `${hash.index}`;
    if (index == 0) {
        return 'class="active"';
    }
    return '';
}

export default helper(activeTab);
