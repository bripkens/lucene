const expect = require('chai').expect;

const lucene = require('../');

describe('queryParser', () => {
  describe('whitespace handling', function() {
    // term parsing
    it('handles empty string', function() {
      var results = lucene.parse('');

      expect(isEmpty(results)).to.equal(true);
    });

    it('handles leading whitespace with no contents', function() {
      var results = lucene.parse(' \r\n');

      expect(isEmpty(results)).to.equal(true);
    });

    it('handles leading whitespace before an expression string', function() {
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


  describe('term parsing', function() {
    // term parsing
    it('parses terms', function() {
      var results = lucene.parse('bar');

      expect(results['left']['term']).to.equal('bar');
    });

    it('parses quoted terms', function() {
      var results = lucene.parse('"fizz buzz"');

      expect(results['left']['term']).to.equal('fizz buzz');
    });

    it('accepts terms with \'-\'', function() {
      var results = lucene.parse('created_at:>now-5d');

      expect(results['left']['term']).to.equal('>now-5d');
    });

    it('accepts terms with \'+\'', function() {
      var results = lucene.parse('published_at:>now+5d');

      expect(results['left']['term']).to.equal('>now+5d');
    });
  });


  describe('term prefix operators', function() {
    it('parses prefix operators (-)', function() {
      var results = lucene.parse('-bar');

      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('-');
    });

    it('parses prefix operator (+)', function() {
      var results = lucene.parse('+bar');

      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('+');
    });

    it('parses prefix operator on quoted term (-)', function() {
      var results = lucene.parse('-"fizz buzz"');

      expect(results['left']['term']).to.equal('fizz buzz');
      expect(results['left']['prefix']).to.equal('-');
    });

    it('parses prefix operator on quoted term (+)', function() {
      var results = lucene.parse('+"fizz buzz"');

      expect(results['left']['term']).to.equal('fizz buzz');
      expect(results['left']['prefix']).to.equal('+');
    });
  });

  describe('field name support', function() {

    it('parses implicit field name for term', function() {
      var results = lucene.parse('bar');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('bar');
    });

    it('parses implicit field name for quoted term', function() {
      var results = lucene.parse('"fizz buzz"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('fizz buzz');
    });

    it('parses explicit field name for term', function() {
      var results = lucene.parse('foo:bar');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('bar');
    });

    it('parses explicit field name for date term', function() {
      var results = lucene.parse('foo:2015-01-01');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('2015-01-01');
    });

    it('parses explicit field name including dots (e.g \'sub.field\') for term', function() {
      var results = lucene.parse('sub.foo:bar');

      expect(results['left']['field']).to.equal('sub.foo');
      expect(results['left']['term']).to.equal('bar');
    });


    it('parses explicit field name for quoted term', function() {
      var results = lucene.parse('foo:"fizz buzz"');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('fizz buzz');
    });

    it('parses explicit field name for term with prefix', function() {
      var results = lucene.parse('foo:-bar');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('-');

      results = lucene.parse('foo:+bar');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term']).to.equal('bar');
      expect(results['left']['prefix']).to.equal('+');
    });

    it('parses explicit field name for quoted term with prefix', function() {
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

  describe('conjunction operators', function() {

    it('parses implicit conjunction operator (OR)', function() {
      var results = lucene.parse('fizz buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (AND)', function() {
      var results = lucene.parse('fizz AND buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (OR)', function() {
      var results = lucene.parse('fizz OR buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('OR');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (NOT)', function() {
      var results = lucene.parse('fizz NOT buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('NOT');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (&&)', function() {
      var results = lucene.parse('fizz && buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['term']).to.equal('buzz');
    });

    it('parses explicit conjunction operator (||)', function() {
      var results = lucene.parse('fizz || buzz');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('OR');
      expect(results['right']['term']).to.equal('buzz');
    });
  });

  describe('parentheses groups', function() {

    it('parses parentheses group', function() {
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

    it('parses parentheses groups with explicit conjunction operators ', function() {
      var results = lucene.parse('fizz AND (buzz OR baz)');

      expect(results['left']['term']).to.equal('fizz');
      expect(results['operator']).to.equal('AND');

      var rightNode = results['right'];

      expect(rightNode['left']['term']).to.equal('buzz');
      expect(rightNode['operator']).to.equal('OR');
      expect(rightNode['right']['term']).to.equal('baz');
    });
  });

  describe('range expressions', function() {

    it('parses inclusive range expression', function() {
      var results = lucene.parse('foo:[bar TO baz]');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term_min']).to.equal('bar');
      expect(results['left']['term_max']).to.equal('baz');
      expect(results['left']['inclusive']).to.equal(true);
    });

    it('parses inclusive range expression', function() {
      var results = lucene.parse('foo:{bar TO baz}');

      expect(results['left']['field']).to.equal('foo');
      expect(results['left']['term_min']).to.equal('bar');
      expect(results['left']['term_max']).to.equal('baz');
      expect(results['left']['inclusive']).to.equal(false);
    });
  });

  describe('Lucene Query syntax documentation examples', function() {

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

    it('parses example: title:"The Right Way" AND text:go', function() {
      var results = lucene.parse('title:"The Right Way" AND text:go');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term']).to.equal('The Right Way');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('text');
      expect(results['right']['term']).to.equal('go');
    });

    it('parses example: title:"Do it right" AND right', function() {
      var results = lucene.parse('title:"Do it right" AND right');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term']).to.equal('Do it right');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('right');
    });

    it('parses example: title:Do it right', function() {
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

    it('parses example: te?t', function() {
      var results = lucene.parse('te?t');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('te?t');
    });

    it('parses example: test*', function() {
      var results = lucene.parse('test*');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('test*');
    });

    it('parses example: te*t', function() {
      var results = lucene.parse('te*t');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('te*t');
    });

    it('parses example: roam~', function() {
      var results = lucene.parse('roam~');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('roam');
      expect(results['left']['similarity']).to.equal(0.5);
    });

    it('parses example: roam~0.8', function() {
      var results = lucene.parse('roam~0.8');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('roam');
      expect(results['left']['similarity']).to.equal(0.8);
    });

    it('parses example: "jakarta apache"~10', function() {
      var results = lucene.parse('"jakarta apache"~10');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['left']['proximity']).to.equal(10);
    });

    it('parses example: mod_date:[20020101 TO 20030101]', function() {
      var results = lucene.parse('mod_date:[20020101 TO 20030101]');

      expect(results['left']['field']).to.equal('mod_date');
      expect(results['left']['term_min']).to.equal('20020101');
      expect(results['left']['term_max']).to.equal('20030101');
      expect(results['left']['inclusive']).to.equal(true);
    });

    it('parses example: title:{Aida TO Carmen}', function() {
      var results = lucene.parse('title:{Aida TO Carmen}');

      expect(results['left']['field']).to.equal('title');
      expect(results['left']['term_min']).to.equal('Aida');
      expect(results['left']['term_max']).to.equal('Carmen');
      expect(results['left']['inclusive']).to.equal(false);
    });

    it('parses example: jakarta apache', function() {
      var results = lucene.parse('jakarta apache');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('apache');
    });

    it('parses example: jakarta^4 apache', function() {
      var results = lucene.parse('jakarta^4 apache');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta');
      expect(results['left']['boost']).to.equal(4);
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('apache');
    });

    it('parses example: "jakarta apache"^4 "Apache Lucene"', function() {
      var results = lucene.parse('"jakarta apache"^4 "Apache Lucene"');


      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['left']['boost']).to.equal(4);
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');

    });

    it('parses example: "jakarta apache" jakarta', function() {
      var results = lucene.parse('"jakarta apache" jakarta');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('jakarta');
    });

    it('parses example: "jakarta apache" OR jakarta', function() {
      var results = lucene.parse('"jakarta apache" OR jakarta');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('OR');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('jakarta');
    });

    it('parses example: "jakarta apache" AND "Apache Lucene"', function() {
      var results = lucene.parse('"jakarta apache" AND "Apache Lucene"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('AND');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');
    });

    it('parses example: +jakarta lucene', function() {
      var results = lucene.parse('+jakarta lucene');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta');
      expect(results['left']['prefix']).to.equal('+');
    });

    it('parses example: "jakarta apache" NOT "Apache Lucene"', function() {
      var results = lucene.parse('"jakarta apache" NOT "Apache Lucene"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('NOT');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');
    });

    it('parses example: NOT "jakarta apache"', function() {
      var results = lucene.parse('NOT "jakarta apache"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['start']).to.equal('NOT');
      expect(results['right']).to.equal(undefined);
      expect(results['operator']).to.equal(undefined);
    });

    it('parses example: "jakarta apache" -"Apache Lucene"', function() {
      var results = lucene.parse('"jakarta apache" -"Apache Lucene"');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('jakarta apache');
      expect(results['operator']).to.equal('<implicit>');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('Apache Lucene');
      expect(results['right']['prefix']).to.equal('-');
    });

    it('parses example: (jakarta OR apache) AND website', function() {
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

    it('parses example: title:(+return +"pink panther")', function() {
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

    it('parses example: java AND NOT yamaha', function() {
      var results = lucene.parse('java AND NOT yamaha');

      expect(results['left']['field']).to.equal('<implicit>');
      expect(results['left']['term']).to.equal('java');
      expect(results['operator']).to.equal('AND NOT');
      expect(results['right']['field']).to.equal('<implicit>');
      expect(results['right']['term']).to.equal('yamaha');
    });

    it('parses example: NOT (java OR python) AND android', function() {
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
});
