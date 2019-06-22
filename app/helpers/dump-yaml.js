import { helper } from '@ember/component/helper';
import JsYaml from "js-yaml";

export function dumpYaml(params, hash) {
   
    return JsYaml.dump(hash.text);
}

export default helper(dumpYaml);
