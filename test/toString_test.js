'use strict';

const expect = require('chai').expect;

const lucene = require('../');

describe('toString', () => {
  it('must handle empty ast', () => {
    testAst(null, '');
    testAst(undefined, '');
    testAst(null, '');
  });

  it('must handle simple terms', () => {
    testStr('bar');
  });

  it('must handle quoted terms', () => {
    testStr('"fizz buz"');
  });

  it('must support field groups', () => {
    testStr('foo:(bar OR baz)');
  });

  it('must support fuzzy', () => {
    testStr('foo~0.6');
  });

  it('must support fuzzy without explicit similarity', () => {
    testStr('foo~');
  });

  it('must drop default similarity value', () => {
    testStr('foo~0.5', 'foo~');
  });

  it('must support terms with \'-\'', () => {
    testStr('created_at:>now-5d');
  });

  it('must support terms with \'+\'', () => {
    testStr('created_at:>now+5d');
  });

  function testAst(ast, expected) {
    expect(lucene.toString(ast)).to.equal(expected);
  }

  function testStr(str, expected) {
    expect(lucene.toString(lucene.parse(str))).to.equal(expected || str);
  }
});
