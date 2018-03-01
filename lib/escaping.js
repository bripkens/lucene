exports.escape = function escape(s) {
  return s.replace(/[\+\-\!\(\)\{\}\[\]\^\"\?\:\\\&\|\'\/\*\~]/g, prefixCharWithBackslashes);
};

exports.escapeQuotedTerm = function escapeQuotedTerm(s) {
  return s.replace(/"/g, prefixCharWithBackslashes);
};

function prefixCharWithBackslashes(char) {
  return '\\' + char;
}

exports.unescape = function unescape(s) {
  return s.replace(/\\([\+\-\!\(\)\{\}\[\]\^\"\?\:\\\&\|\'\/\*\~])/g, extractChar);
};

function extractChar(match, char) {
  return char;
}

exports.requiresQuotes = function requiresQuotes(s) {
  return s.indexOf(' ') !== -1 || s.indexOf('\\') !== -1;
};
