export function escape(s) {
  return s.replace(/[\+\-\!\(\)\{\}\[\]\^\"\?\:\\\&\|\'\/\s\*\~]/g, prefixCharWithBackslashes);
}

function prefixCharWithBackslashes(char) {
  return '\\' + char;
}

export function unescape(s) {
  return s.replace(/\\([\+\-\!\(\)\{\}\[\]\^\"\?\:\\\&\|\'\/\s\*\~])/g, extractChar);
}

function extractChar(match, char) {
  return char;
}

export function escapePhrase(s) {
  return s.replace(/"/g, prefixCharWithBackslashes);
}

export function unescapePhrase(s) {
  return s.replace(/\\(")/g, extractChar);
}
