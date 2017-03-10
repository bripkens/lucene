var StringStream = require('./StringStream');

var OPERATORS = ['AND', 'OR', 'NOT', '+', '-'];
var TERM_START_REGEXP = /[a-z0-9\_\.]/i;
var TERM_CONTINUATION_REGEXP = /[a-z0-9\*\?\.\_]/i;
var WHITESPACE_REGEXP = /\s/;

module.exports = exports = function lexFirstStage(source) {
  var stream = new StringStream(source);
  var result = [];

  while (stream.hasNext()) {
    attemptExtraction(stream, result);
  }

  return result;
};


function attemptExtraction(stream, result) {
  for (var i = 0; i < OPERATORS.length; i++) {
    var extractedToken = stream.eat(OPERATORS[i]);
    if (extractedToken != null) {
      extractedToken.token = 'operator';
      result.push(extractedToken);
      return;
    }
  }

  var startPosition = stream.position;
  var char = stream.next();

  // is it grouping?
  if ('(' === char || ')' === char) {
    result.push({
      token: 'grouping',
      lexeme: char,
      start: startPosition,
      end: startPosition + 1
    });

  // ranges
  } else if (/\{|\}|\[|\]/.test(char)) {
    result.push({
      token: 'range',
      lexeme: char,
      start: startPosition,
      end: startPosition + 1
    });

  // Is it whitespace?
  } else if (WHITESPACE_REGEXP.test(char)) {
    var whitespaceToken = stream.eatWhile(WHITESPACE_REGEXP);
    whitespaceToken.lexeme = char + whitespaceToken.lexeme;
    whitespaceToken.start = startPosition;
    whitespaceToken.token = 'whitespace';
    result.push(whitespaceToken);

  // is it a term?
  } else if (TERM_START_REGEXP.test(char)) {
    var termToken = stream.eatWhile(TERM_CONTINUATION_REGEXP);
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

  // Is it a regex?
  } else if (char === '/') {
    var regexToken = stream.eatWhile(function(eachChar, gatheredLexeme) {
      if (eachChar !== '/') {
        return true;
      }

      // Quotes may be escaped to write a quote character, but also two backslashes
      // may be used to write a simple backslash, i.e. to escape a backslash.
      const backslashesAtTheEndMatch = gatheredLexeme.match(/([\\]+)$/);
      const stop = !backslashesAtTheEndMatch || backslashesAtTheEndMatch[1].length % 2 === 0;
      return !stop;
    });
    // stream may either have been consumed or the phrase might properly end
    if (stream.peek() === '/') {
      regexToken.lexeme = char + regexToken.lexeme + stream.next();
      regexToken.start = startPosition;
      regexToken.end = stream.getPosition();
    } else {
      regexToken.lexeme = char + regexToken.lexeme;
      regexToken.start = startPosition;
    }
    regexToken.token = 'regex';
    result.push(regexToken);

  // fields
  } else if (char === ':') {
    result.push({
      token: 'fieldSeparator',
      lexeme: char,
      start: startPosition,
      end: startPosition + 1
    });

  } else if (char === '~') {
    var fuzzy = stream.eatWhile(/\d|\./);
    fuzzy.start = startPosition;
    fuzzy.token = 'fuzzy';
    fuzzy.lexeme = char + fuzzy.lexeme;
    result.push(fuzzy);

  // boosting?
  } else if (char === '^') {
    var boost = stream.eatWhile(/\d/);
    boost.start = startPosition;
    boost.token = 'boost';
    boost.lexeme = char + boost.lexeme;
    result.push(boost);

  } else {
    result.push({
      token: 'unknown',
      lexeme: char,
      start: startPosition,
      end: startPosition + 1
    });
  }
}
