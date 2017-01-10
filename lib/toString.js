'use strict';

const implicit = '<implicit>';

module.exports = function toString(ast) {
  if (!ast) {
    return '';
  }

  let result = '';

  if (ast.start != null) {
    result += ast.start + ' ';
  }

  if (ast.field && ast.field !== implicit) {
    result += ast.field + ':';
  }

  if (ast.left) {
    if (ast.parenthesized) {
      result += '(';
    }
    result += toString(ast.left);
  }

  if (ast.operator) {
    if (ast.left) {
      result += ' ';
    }

    if (ast.operator !== implicit) {
      result += ast.operator;
    }
  }

  if (ast.right) {
    if (ast.operator && ast.operator !== implicit) {
      result += ' ';
    }
    result += toString(ast.right);

    if (ast.parenthesized) {
      result += ')';
    }
  }

  if (ast.term) {
    if (ast.prefix) {
      result += ast.prefix;
    }
    if (ast.quoted) {
      result += '"';
    }
    result += ast.term;
    if (ast.quoted) {
      result += '"';
    }

    if (ast.proximity != null) {
      result += '~' + ast.proximity;
    }

    if (ast.boost != null) {
      result += '^' + ast.boost;
    }
  }

  if (ast.term_min) {
    if (ast.inclusive) {
      result += '[';
    } else {
      result += '{';
    }

    result += ast.term_min;
    result += ' TO ';
    result += ast.term_max;

    if (ast.inclusive) {
      result += ']';
    } else {
      result += '}';
    }
  }

  if (ast.similarity) {
    result += '~';

    if (ast.similarity !== 0.5) {
      result += ast.similarity;
    }
  }

  return result;
};
