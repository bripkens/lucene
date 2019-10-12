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

  it('must handle simple terms with explicit field name in round parentheses', () => {
    testStr('foo:(bar)');
  });

  it('must handle quoted terms', () => {
    testStr('"fizz buz"');
  });

  it('must handle empty quoted terms', () => {
    testStr('""');
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

  it('must support regex terms', () => {
    testStr('/^fizz b?u[A-z]/');
  });

  it('must support keyed regex terms', () => {
    testStr('some.key:/[mh]otel/');
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

  it('must support empty quoted string with explicit field names', () => {
    testStr('foo:""');
  });

  it('must support prefixes and explicit field names (-)', () => {
    testStr('foo:-bar');
  });

  it('must support prefixes and explicit field names in round parentheses (-)', () => {
    testStr('foo:(-bar)');
  });

  it('must support prefixes and explicit field names (+)', () => {
    testStr('foo:+bar');
  });

  it('must support prefixes and explicit field names in round parentheses (+)', () => {
    testStr('foo:(+bar)');
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

  it('must support mixed range expressions (left inclusive)', () => {
    testStr('foo:[bar TO baz}');
  });

  it('must support mixed range expressions (right inclusive)', () => {
    testStr('foo:{bar TO baz]');
  });

  it('must support mixed range expressions (right inclusive) with date ISO format', () => {
    testStr('date:{2017-11-17T01:32:45.123Z TO 2017-11-18T04:28:11.999Z]');
  });

  it('must support lucene example: title:"The Right Way" AND text:go', () => {
    testStr('title:"The Right Way" AND text:go');
  });

  it('must support lucene example: title:"Do it right" AND right', () => {
    testStr('title:"Do it right" AND right');
  });

  it('must support lucene example: title:Do it right', () => {
    testStr('title:Do it right');
  });

  it('must support lucene example: te?t', () => {
    testStr('te?t');
  });

  it('must support lucene example: test*', () => {
    testStr('test*');
  });

  it('must support lucene example: te*t', () => {
    testStr('te*t');
  });

  it('must support lucene example: roam~', () => {
    testStr('roam~');
  });

  it('must support lucene example: roam~0.8', () => {
    testStr('roam~0.8');
  });

  it('must support lucene example: "jakarta apache"~10', () => {
    testStr('"jakarta apache"~10');
  });

  it('must support lucene example: mod_date:[20020101 TO 20030101]', () => {
    testStr('mod_date:[20020101 TO 20030101]');
  });

  it('must support lucene example: title:{Aida TO Carmen}', () => {
    testStr('title:{Aida TO Carmen}');
  });

  it('must support lucene example: jakarta apache', () => {
    testStr('jakarta apache');
  });

  it('must support lucene example: jakarta^4 apache', () => {
    testStr('jakarta^4 apache');
  });

  it('must support lucene example: "jakarta apache"^4 "Apache Lucene"', () => {
    testStr('"jakarta apache"^4 "Apache Lucene"');
  });

  it('must support lucene example: "jakarta apache" jakarta', () => {
    testStr('"jakarta apache" jakarta');
  });

  it('must support lucene example: "jakarta apache" OR jakarta', () => {
    testStr('"jakarta apache" OR jakarta');
  });

  it('must support lucene example: "jakarta apache" AND "Apache Lucene"', () => {
    testStr('"jakarta apache" AND "Apache Lucene"');
  });

  it('must support lucene example: +jakarta lucene', () => {
    testStr('+jakarta lucene');
  });

  it('must support lucene example: "jakarta apache" NOT "Apache Lucene"', () => {
    testStr('"jakarta apache" NOT "Apache Lucene"');
  });

  it('must support lucene example: NOT "jakarta apache"', () => {
    testStr('NOT "jakarta apache"');
  });

  it('must support lucene example: "jakarta apache" -"Apache Lucene"', () => {
    testStr('"jakarta apache" -"Apache Lucene"');
  });

  it('must support lucene example: (jakarta OR apache) AND website', () => {
    testStr('(jakarta OR apache) AND website');
  });

  it('must support lucene example: title:(+return +"pink panther")', () => {
    testStr('title:(+return +"pink panther")');
  });

  it('must support strings with quotes', () => {
    testStr('foo:"start \\" end"');
  });

  it('must support escaped characters', () => {
    testStr('foo\\(\\)\\{\\}\\+\\~\\!\\?\\[\\]\\:\\*bar');
  });

  it('must support escaped whitespace', () => {
    testStr('foo:a\\ b');
  });

  it('must support whitespace in parens', () => {
    testStr('foo ( bar OR baz)', 'foo (bar OR baz)');
  });

  it('must support ! prefix operator', () => {
    testStr('-author:adams');
  });

  it('must support parenthesized expressions with start set', () => {
    testStr('prop:value1 AND (NOT _exists_:other OR other:value2)');
  });

  it('must support parenthesized expressions with start set and not', () => {
    testStr('prop:value1 AND (NOT _exists_:other OR other:value2)', 'prop:value1 AND (NOT _exists_:other OR other:value2)');
  });

  function testAst(ast, expected) {
    expect(lucene.toString(ast)).to.equal(expected, 'Got the following AST: ' + JSON.stringify(ast, 0, 2));
  }

  function testStr(str, expected) {
    testAst(lucene.parse(str), expected != null ? expected : str);
  }
});
