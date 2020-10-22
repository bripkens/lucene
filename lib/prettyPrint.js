const toString = require('./toString');

var implicit = '<implicit>';

function generateSpace(indent) {
  return Array(indent).fill(' ').join('');
}

function prettyPrint(ast, indent = 0) {
  if (ast) {
    if ('term' in ast) {
      return toString(ast);
    }

    const spaces = generateSpace(indent);
    const spacesPlus2 = generateSpace(indent + 2);

    let prefix = '';
    if (ast.field != null && ast.field !== implicit) {
      if (ast.term_min != null) {
        return toString(ast);
      } else {
        prefix += ast.field + ':';
      }
    }

    if (ast.start != null) {
      prefix += (ast.parenthesized ? `(\n${spacesPlus2}` : '') + ast.start + ' ';
    }

    if (ast.operator != null) {
      const operator = ast.operator === implicit ? '' : ast.operator;
      

      if (ast.parenthesized) {
        const startingParenthesis = ast.start != null ? `${prefix}`: `${prefix}(\n${spacesPlus2}`;
        const inside = `${ast.left ? prettyPrint(ast.left, indent + 2) : ''}\n${spacesPlus2 + operator} ${prettyPrint(ast.right, indent + 2)}`;
        return `${startingParenthesis}${inside}\n${spaces})`;
      }

      return `${prefix}${ast.left ? prettyPrint(ast.left, indent) : ''}\n${spaces + operator} ${prettyPrint(ast.right, indent)}`;
    }
    if (ast.parenthesized) {
      return `${prefix}(${prettyPrint(ast.left, indent)})`;
    } else {
      return `${prefix}${prettyPrint(ast.left, indent)}`;
    }
  }
  return '';
}

module.exports = prettyPrint;
