var StringStream = require('./StringStream');

var TERM_REGEXP = /[a-z0-9\.]/i;
var WHITESPACE_REGEXP = /\s/;

module.exports = exports = function lexFirstStage(source) {
  var stream = new StringStream(source);
  var result = [];

  while (stream.hasNext()) {
    var startPosition = stream.position;
    var char = stream.next();

    // Is it whitespace?
    if (WHITESPACE_REGEXP.test(char)) {
      var whitespaceToken = stream.eatWhile(WHITESPACE_REGEXP);
      whitespaceToken.lexeme = char + whitespaceToken.lexeme;
      whitespaceToken.start = startPosition;
      whitespaceToken.token = 'whitespace';
      result.push(whitespaceToken);

    // is it a term?
    } else if (TERM_REGEXP.test(char)) {
      var termToken = stream.eatWhile(TERM_REGEXP);
      termToken.lexeme = char + termToken.lexeme;
      termToken.start = startPosition;
      termToken.token = 'term';
      result.push(termToken);

    // Is it a phrase (quoted string)?
    } else if (char === '"') {
      var phraseToken = stream.eatWhile(function(eachChar, gatheredLexeme) {
        if (eachChar !== '"') {
          return true;
        }

        // Quotes may be escaped to write a quote character, but also two backslashes
        // may be used to write a simple backslash, i.e. to escape a backslash.
        const backslashesAtTheEndMatch = gatheredLexeme.match(/([\\]+)$/);
        const stop = !backslashesAtTheEndMatch || backslashesAtTheEndMatch[1].length % 2 === 0;
        return !stop;
      });
      // stream may either have been consumed or the phrase might properly end
      if (stream.peek() === '"') {
        phraseToken.lexeme = char + phraseToken.lexeme + stream.next();
        phraseToken.start = startPosition;
        phraseToken.end = stream.getPosition();
      } else {
        phraseToken.lexeme = char + phraseToken.lexeme;
        phraseToken.start = startPosition;
      }
      phraseToken.token = 'phrase';
      result.push(phraseToken);
    } else if (char === ':') {
      result.push({
        token: 'fieldSeparator',
        lexeme: char,
        start: startPosition,
        end: startPosition + 1
      });
    }
  }

  return result;
};
