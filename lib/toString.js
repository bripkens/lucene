'use strict';

const implicit = '<implicit>';

module.exports = function toString(ast) {
  if (!ast) {
    return '';
  }

  let result = '';

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

    result += ast.operator;
  }

  if (ast.right) {
    if (ast.operator) {
      result += ' ';
    }
    result += toString(ast.right);

    if (ast.parenthesized) {
      result += ')';
    }
  }

  if (ast.term) {
    if (ast.quoted) {
      result += '"';
    }
    result += ast.term;
    if (ast.quoted) {
      result += '"';
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
