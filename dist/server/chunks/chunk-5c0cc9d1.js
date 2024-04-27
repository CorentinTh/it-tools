import { parse } from 'iarna-toml-esm';
import { i as isNotThrowing } from './chunk-5697d061.js';

function isValidToml(toml) {
  return isNotThrowing(() => parse(toml));
}

export { isValidToml as i };
