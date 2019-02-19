
import queryParser from './queryParser';
import * as escaping from './escaping';

export var parse = queryParser.parse.bind(queryParser);
export { toString } from './toString';

export var term = {
  escape: escaping.escape,
  unescape: escaping.unescape
};

export var phrase = {
  escape: escaping.escapePhrase,
  unescape: escaping.unescapePhrase
};
