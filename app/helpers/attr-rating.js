import { helper } from '@ember/component/helper';

export function attrRating(params, hash) {
    return (new Array(hash.max)).fill({}).map(function (fill, i) { return { fill: i+1 <= hash.rating }; });
}

export default helper(attrRating);
