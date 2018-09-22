import { helper } from '@ember/component/helper';

export function attrRating(params, hash) {
//	console.log(params, hash);
	var a= (new Array(hash.max)).fill({}).map(function (fill, i) { return { fill: i <= hash.rating }; });
// console.log(a)
        return a;
	//  let text = `${hash.text}`;
  //  return ansi_up.ansi_to_html(text, { use_classes: true });
}

export default helper(attrRating);
