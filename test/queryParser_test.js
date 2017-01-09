const expect = require('chai').expect;

const lucene = require('../');

describe('queryParser', () => {
  describe('whitespace handling', () => {
    // term parsing
    it('handles empty string', () => {
      var results = lucene.parse('');

      expect(isEmpty(results)).to.equal(true);
    });

    it('handles leading whitespace with no contents', () => {
      var results = lucene.parse(' \r\n');

      expect(isEmpty(results)).to.equal(true);
    });

    it('handles leading whitespace before an expression string', () => {
      var results = lucene.parse(' Test:Foo');

      expect(results['left']['field']).to.equal('Test');
      expect(results['left']['term']).to.equal('Foo');
    });

    function isEmpty(arr) {
      for (var i in arr) {
        return false;
      }
      return true;
    }
  });


  describe('term parsing', () => {
    // term parsing
    it('parses terms', () => {
      var results = lucene.parse('bar');

      expect(results['left']['term']).to.equal('bar');
    });

    it('parses quoted terms', () => {
      var results = lucene.parse('"fizz buzz"');

      expect(results['left']['term']).to.equal('fizz buzz');
    });

    it('accepts terms with \'-\'', () => {
      var results = lucene.parse('created_at:>now-5d');

      expect(results['left']['term']).to.equal('>now-5d');
    });

    it('accepts terms with \'+\'', () => {
      var results = lucene.parse('published_at:>now+5d');

      expect(results['left']['term']).to.equal('>now+5d');
    });
  });


  describe('term prefix operators', () => {
    it('parses prefix operators (-)', () => {
      var results = lucene.parse('-bar');

      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('-');
    });

    it('parses prefix operator (+)', () => {
      var results = lucene.parse('+bar');

      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('+');
    });

    it('parses prefix operator on quoted term (-)', () => {
      var results = lucene.parse('-"fizz buzz"');

      expect(results['left']['term']).to.equal('fizz buzz');
      expect(results['left']['prefix']).to.equal('-');
    });

    it('parses prefix operator on quoted term (+)', () => {
      var results = lucene.parse('+"fizz buzz"');

      expect(results['left']['term']).to.equal('fizz buzz');
      expect(results['left']['prefix']).to.equal('+');
    });
  });

  describe('field name support', () => {

    it('parses implicit field name for term', () => {
      var results = lucene.parse('bar');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('bar');
    });

    it('parses implicit field name for quoted term', () => {
      var results = lucene.parse('"fizz buzz"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('fizz buzz');
    });

    it('parses explicit field name for term', () => {
      var results = lucene.parse('foo:bar');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('bar');
    });

    it('parses explicit field name for date term', () => {
      var results = lucene.parse('foo:2015-01-01');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('2015-01-01');
    });

    it('parses explicit field name including dots (e.g \'sub.field\') for term', () => {
      var results = lucene.parse('sub.foo:bar');

      expect(results['left']['field']).to.equal('sub.foo');
      expect(results['left']['term']).to.equal('bar');
    });


    it('parses explicit field name for quoted term', () => {
      var results = lucene.parse('foo:"fizz buzz"');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('fizz buzz');
    });

    it('parses explicit field name for term with prefix', () => {
      var results = lucene.parse('foo:-bar');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('-');

      results = lucene.parse('foo:+bar');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('+');
    });

    it('parses explicit field name for quoted term with prefix', () => {
      var results = lucene.parse('foo:-"fizz buzz"');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('fizz buzz');
      expect(results['left']['prefix']).to.equal('-');

      results = lucene.parse('foo:+"fizz buzz"');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('fizz buzz');
      expect(results['left']['prefix']).to.equal('+');
    });

  });

  describe('conjunction operators', () => {

    it('parses implicit conjunction operator (OR)', () => {
      var results = lucene.parse('fizz buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (AND)', () => {
      var results = lucene.parse('fizz AND buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (OR)', () => {
      var results = lucene.parse('fizz OR buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('OR');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (NOT)', () => {
      var results = lucene.parse('fizz NOT buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('NOT');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (&&)', () => {
      var results = lucene.parse('fizz && buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (||)', () => {
      var results = lucene.parse('fizz || buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('OR');
      expect(results['right']['term']).to.equal('buzz');
    });
  });

  describe('parentheses groups', () => {
    it('parses parentheses group', () => {
      var results = lucene.parse('fizz (buzz baz)');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['parenthesized']).to.equal(undefined);

      var rightNode = results['right'];

      expect(rightNode['left']['term']).to.equal('buzz');
      expect(rightNode['operator']).to.equal('<implicit>');
      expect(rightNode['parenthesized']).to.equal(true);
      expect(rightNode['right']['term']).to.equal('baz');
    });

    it('parses parentheses groups with explicit conjunction operators ', () => {
      var results = lucene.parse('fizz AND (buzz OR baz)');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('AND');

      var rightNode = results['right'];

      expect(rightNode['left']['term']).to.equal('buzz');
      expect(rightNode['operator']).to.equal('OR');
      expect(rightNode['right']['term']).to.equal('baz');
    });
  });

  describe('range expressions', () => {

    it('parses inclusive range expression', () => {
      var results = lucene.parse('foo:[bar TO baz]');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term_min']).to.equal('bar');
      expect(results['left']['term_max']).to.equal('baz');
      expect(results['left']['inclusive']).to.equal(true);
    });

    it('parses inclusive range expression', () => {
      var results = lucene.parse('foo:{bar TO baz}');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term_min']).to.equal('bar');
      expect(results['left']['term_max']).to.equal('baz');
      expect(results['left']['inclusive']).to.equal(false);
    });
  });

  describe('Lucene Query syntax documentation examples', () => {

    /*
        Examples from Lucene documentation at

        http://lucene.apache.org/java/2_9_4/queryparsersyntax.html

        title:"The Right Way" AND text:go
        title:"Do it right" AND right
        title:Do it right

        te?t
        test*
        te*t

        roam~
        roam~0.8

        "jakarta apache"~10
        mod_date:[20020101 TO 20030101]
        title:{Aida TO Carmen}

        jakarta apache
        jakarta^4 apache
        "jakarta apache"^4 "Apache Lucene"
        "jakarta apache" jakarta
        "jakarta apache" OR jakarta
        "jakarta apache" AND "Apache Lucene"
        +jakarta lucene
        "jakarta apache" NOT "Apache Lucene"
        NOT "jakarta apache"
        "jakarta apache" -"Apache Lucene"
        (jakarta OR apache) AND website
        title:(+return +"pink panther")
    */

    it('parses example: title:"The Right Way" AND text:go', () => {
      var results = lucene.parse('title:"The Right Way" AND text:go');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term']).to.equal('The Right Way');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('text');
      expect(results['right']['term']).to.equal('go');
    });

    it('parses example: title:"Do it right" AND right', () => {
      var results = lucene.parse('title:"Do it right" AND right');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term']).to.equal('Do it right');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('right');
    });

    it('parses example: title:Do it right', () => {
      var results = lucene.parse('title:Do it right');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term']).to.equal('Do');
      expect(results['operator']).to.equal('<implicit>');

      var rightNode = results['right'];

      expect(rightNode['left']['field']).to.equal('<implicit>');
      expect(rightNode['left']['term']).to.equal('it');
      expect(rightNode['operator']).to.equal('<implicit>');

      expect(rightNode['right']['field']).to.equal('<implicit>');
      expect(rightNode['right']['term']).to.equal('right');
    });

    it('parses example: te?t', () => {
      var results = lucene.parse('te?t');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('te?t');
    });

    it('parses example: test*', () => {
      var results = lucene.parse('test*');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('test*');
    });

    it('parses example: te*t', () => {
      var results = lucene.parse('te*t');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('te*t');
    });

    it('parses example: roam~', () => {
      var results = lucene.parse('roam~');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('roam');
      expect(results['left']['similarity']).to.equal(0.5);
    });

    it('parses example: roam~0.8', () => {
      var results = lucene.parse('roam~0.8');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('roam');
      expect(results['left']['similarity']).to.equal(0.8);
    });

    it('parses example: "jakarta apache"~10', () => {
      var results = lucene.parse('"jakarta apache"~10');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['left']['proximity']).to.equal(10);
    });

    it('parses example: mod_date:[20020101 TO 20030101]', () => {
      var results = lucene.parse('mod_date:[20020101 TO 20030101]');

      expect(results['left']['field']).to.equal('mod_date');
      expect(results['left']['term_min']).to.equal('20020101');
      expect(results['left']['term_max']).to.equal('20030101');
      expect(results['left']['inclusive']).to.equal(true);
    });

    it('parses example: title:{Aida TO Carmen}', () => {
      var results = lucene.parse('title:{Aida TO Carmen}');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term_min']).to.equal('Aida');
      expect(results['left']['term_max']).to.equal('Carmen');
      expect(results['left']['inclusive']).to.equal(false);
    });

    it('parses example: jakarta apache', () => {
      var results = lucene.parse('jakarta apache');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('apache');
    });

    it('parses example: jakarta^4 apache', () => {
      var results = lucene.parse('jakarta^4 apache');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta');
      expect(results['left']['boost']).to.equal(4);
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('apache');
    });

    it('parses example: "jakarta apache"^4 "Apache Lucene"', () => {
      var results = lucene.parse('"jakarta apache"^4 "Apache Lucene"');


      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['left']['boost']).to.equal(4);
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');

    });

    it('parses example: "jakarta apache" jakarta', () => {
      var results = lucene.parse('"jakarta apache" jakarta');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('jakarta');
    });

    it('parses example: "jakarta apache" OR jakarta', () => {
      var results = lucene.parse('"jakarta apache" OR jakarta');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('OR');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('jakarta');
    });

    it('parses example: "jakarta apache" AND "Apache Lucene"', () => {
      var results = lucene.parse('"jakarta apache" AND "Apache Lucene"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');
    });

    it('parses example: +jakarta lucene', () => {
      var results = lucene.parse('+jakarta lucene');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta');
      expect(results['left']['prefix']).to.equal('+');
    });

    it('parses example: "jakarta apache" NOT "Apache Lucene"', () => {
      var results = lucene.parse('"jakarta apache" NOT "Apache Lucene"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('NOT');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');
    });

    it('parses example: NOT "jakarta apache"', () => {
      var results = lucene.parse('NOT "jakarta apache"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['start']).to.equal('NOT');
      expect(results['right']).to.equal(undefined);
      expect(results['operator']).to.equal(undefined);
    });

    it('parses example: "jakarta apache" -"Apache Lucene"', () => {
      var results = lucene.parse('"jakarta apache" -"Apache Lucene"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');
      expect(results['right']['prefix']).to.equal('-');
    });

    it('parses example: (jakarta OR apache) AND website', () => {
      var results = lucene.parse('(jakarta OR apache) AND website');
      var leftNode = results['left'];

      expect(leftNode['left']['field']).to.equal('<implicit>');
      expect(leftNode['left']['term']).to.equal('jakarta');
      expect(leftNode['operator']).to.equal('OR');
      expect(leftNode['right']['field']).to.equal('<implicit>');
      expect(leftNode['right']['term']).to.equal('apache');

      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('website');
    });

    it('parses example: title:(+return +"pink panther")', () => {
      var results = lucene.parse('title:(+return +"pink panther")');
      var leftNode = results['left'];

      expect(leftNode['left']['field']).to.equal('<implicit>');
      expect(leftNode['left']['term']).to.equal('return');
      expect(leftNode['left']['prefix']).to.equal('+');
      expect(leftNode['operator']).to.equal('<implicit>');
      expect(leftNode['right']['field']).to.equal('<implicit>');
      expect(leftNode['right']['term']).to.equal('pink panther');
      expect(leftNode['right']['prefix']).to.equal('+');
      expect(leftNode['field']).to.equal('title');
    });

    it('parses example: java AND NOT yamaha', () => {
      var results = lucene.parse('java AND NOT yamaha');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('java');
      expect(results['operator']).to.equal('AND NOT');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('yamaha');
    });

    it('parses example: NOT (java OR python) AND android', () => {
      var results = lucene.parse('NOT (java OR python) AND android');
      var leftNode = results['left'];

      expect(results['start']).to.equal('NOT');

      expect(leftNode['left']['field']).to.equal('<implicit>');
      expect(leftNode['left']['term']).to.equal('java');
      expect(leftNode['operator']).to.equal('OR');
      expect(leftNode['right']['field']).to.equal('<implicit>');
      expect(leftNode['right']['term']).to.equal('python');

      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('android');
    });
  });

  describe('syntax errors', () => {
    it('must throw on missing brace', () => {
      expect(() => lucene.parse('(foo:bar')).to.throw(/SyntaxError: Expected/);
    });
  });
});
