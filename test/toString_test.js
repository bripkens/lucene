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

  it('must handle simple terms with explicit field name', () => {
    testStr('foo:bar');
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

  it('must support prefix operators (-)', () => {
    testStr('-bar');
  });

  it('must support prefix operators (+)', () => {
    testStr('+bar');
  });

  it('must support prefix operators (-) on quoted terms', () => {
    testStr('-"fizz buzz"');
  });

  it('must support prefix operators (+) on quoted terms', () => {
    testStr('+"fizz buzz"');
  });

  it('must support dates as terms', () => {
    testStr('foo:2015-01-01');
  });

  it('must support dots in field names', () => {
    testStr('sub.foo:bar');
  });

  it('must support quoted string with explicit field names', () => {
    testStr('foo:"fizz buzz"');
  });

  it('must support prefixes and explicit field names (-)', () => {
    testStr('foo:-bar');
  });

  it('must support prefixes and explicit field names (+)', () => {
    testStr('foo:+bar');
  });

  it('must support quoted prefixes', () => {
    testStr('foo:-"fizz buzz"');
  });

  it('must support implicit conjunction operators', () => {
    testStr('fizz buzz');
  });

  it('must support explicit conjunction operators (OR)', () => {
    testStr('fizz OR buzz');
  });

  it('must support explicit conjunction operators (AND)', () => {
    testStr('fizz AND buzz');
  });

  it('must support explicit conjunction operators (NOT)', () => {
    testStr('fizz NOT buzz');
  });

  it('must support explicit conjunction operators (&&)', () => {
    testStr('fizz && buzz');
  });

  it('must support explicit conjunction operators (||)', () => {
    testStr('fizz || buzz');
  });

  it('must support parentheses groups', () => {
    testStr('fizz (buzz baz)');
  });

  it('must support parentheses groups with explicit conjunction operators', () => {
    testStr('fizz AND (buzz OR baz)');
  });

  it('must support inclusive range expressions', () => {
    testStr('foo:[bar TO baz]');
  });

  it('must support exclusive range expressions', () => {
    testStr('foo:{bar TO baz}');
  });

  function testAst(ast, expected) {
    expect(lucene.toString(ast)).to.equal(expected);
  }

  function testStr(str, expected) {
    const ast = lucene.parse(str);
    expect(lucene.toString(ast))
      .to.equal(expected || str, 'Got the following AST: ' + JSON.stringify(ast, 0, 2));
  }
});
