'use strict';

const expect = require('chai').expect;

const lexFirstStage = require('../../lib/lexer/firstStage');

describe.only('lexer/firstStage', () => {
  describe('terms', () => {
    it('must parse simple terms', () => {
      expect(lexFirstStage('hello')).to.deep.equal([
        {
          token: 'term',
          lexeme: 'hello',
          start: 0,
          end: 5
        }
      ]);
    });
  });

  describe('phrases', () => {
    it('must parse simple phrases', () => {
      expect(lexFirstStage('"foo bar"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"foo bar"',
          start: 0,
          end: 9
        }
      ]);
    });

    it('must support escaped quotes', () => {
      expect(lexFirstStage('"a\\"b"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\"b"',
          start: 0,
          end: 6
        }
      ]);
    });

    it('must support escaped quotes at the end of a phrase', () => {
      expect(lexFirstStage('"a\\""')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\""',
          start: 0,
          end: 5
        }
      ]);
    });

    it('must ignore multiple escaped backslashes at in phrases', () => {
      expect(lexFirstStage('"a\\\\"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\\\"',
          start: 0,
          end: 5
        }
      ]);
    });

    it('must consume to the end of the source when the phrase does not end', () => {
      expect(lexFirstStage('"a\\\\\\"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\\\\\"',
          start: 0,
          end: 6
        }
      ]);
    });

    it('must support escaped backslash and normal backslash at the end of a phrase', () => {
      expect(lexFirstStage('"a\\\\\\" abc"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\\\\\" abc"',
          start: 0,
          end: 11
        }
      ]);
    });
  });

  describe('whitespace', () => {
    it('must parse just whitespace', () => {
      expect(lexFirstStage(' \n\t ')).to.deep.equal([
        {
          token: 'whitespace',
          lexeme: ' \n\t ',
          start: 0,
          end: 4
        }
      ]);
    });
  });

  describe('operators', () => {
    it('must parse AND operator', () => {
      expect(lexFirstStage('AND')).to.deep.equal([
        {
          token: 'operator',
          lexeme: 'AND',
          start: 0,
          end: 3
        }
      ]);
    });

    it('must parse OR operator', () => {
      expect(lexFirstStage('OR')).to.deep.equal([
        {
          token: 'operator',
          lexeme: 'OR',
          start: 0,
          end: 2
        }
      ]);
    });

    it('must parse NOT operator', () => {
      expect(lexFirstStage('NOT')).to.deep.equal([
        {
          token: 'operator',
          lexeme: 'NOT',
          start: 0,
          end: 3
        }
      ]);
    });

    it('must parse + operator', () => {
      expect(lexFirstStage('+')).to.deep.equal([
        {
          token: 'operator',
          lexeme: '+',
          start: 0,
          end: 1
        }
      ]);
    });

    it('must parse - operator', () => {
      expect(lexFirstStage('-')).to.deep.equal([
        {
          token: 'operator',
          lexeme: '-',
          start: 0,
          end: 1
        }
      ]);
    });
  });

  describe('grouping', () => {
    it('must parse grouping start', () => {
      expect(lexFirstStage('(')).to.deep.equal([
        {
          token: 'grouping',
          lexeme: '(',
          start: 0,
          end: 1
        }
      ]);
    });

    it('must parse grouping end', () => {
      expect(lexFirstStage(')')).to.deep.equal([
        {
          token: 'grouping',
          lexeme: ')',
          start: 0,
          end: 1
        }
      ]);
    });
  });

  describe('boosting', () => {
    it('must parse boosts', () => {
      expect(lexFirstStage('^2')).to.deep.equal([
        {
          token: 'boost',
          lexeme: '^2',
          start: 0,
          end: 2
        }
      ]);
    });

    it('must parse boost even when there is no boost value', () => {
      expect(lexFirstStage('^bar')).to.deep.equal([
        {
          token: 'boost',
          lexeme: '^',
          start: 0,
          end: 1
        },
        {
          token: 'term',
          lexeme: 'bar',
          start: 1,
          end: 4
        }
      ]);
    });
  });

  describe('combinations', () => {
    it('must parse terms and phrases', () => {
      expect(lexFirstStage('foo "bar"')).to.deep.equal([
        {
          token: 'term',
          lexeme: 'foo',
          start: 0,
          end: 3
        },
        {
          token: 'whitespace',
          lexeme: ' ',
          start: 3,
          end: 4
        },
        {
          token: 'phrase',
          lexeme: '"bar"',
          start: 4,
          end: 9
        }
      ]);
    });

    it('must support fielded data', () => {
      expect(lexFirstStage('foo.bar:42')).to.deep.equal([
        {
          token: 'term',
          lexeme: 'foo.bar',
          start: 0,
          end: 7
        },
        {
          token: 'fieldSeparator',
          lexeme: ':',
          start: 7,
          end: 8
        },
        {
          token: 'term',
          lexeme: '42',
          start: 8,
          end: 10
        }
      ]);
    });

    it('must support field grouping', () => {
      expect(lexFirstStage('title:(+return +"pink panther")')).to.deep.equal([
        {
          'start': 0,
          'end': 5,
          'lexeme': 'title',
          'token': 'term'
        },
        {
          'start': 5,
          'end': 6,
          'lexeme': ':',
          'token': 'fieldSeparator'
        },
        {
          'start': 6,
          'end': 7,
          'lexeme': '(',
          'token': 'grouping'
        },
        {
          'start': 7,
          'end': 8,
          'lexeme': '+',
          'token': 'operator'
        },
        {
          'start': 8,
          'end': 14,
          'lexeme': 'return',
          'token': 'term'
        },
        {
          'start': 14,
          'end': 15,
          'lexeme': ' ',
          'token': 'whitespace'
        },
        {
          'start': 15,
          'end': 16,
          'lexeme': '+',
          'token': 'operator'
        },
        {
          'start': 16,
          'end': 30,
          'lexeme': '"pink panther"',
          'token': 'phrase'
        },
        {
          'start': 30,
          'end': 31,
          'lexeme': ')',
          'token': 'grouping'
        }
      ]);
    });
  });
});
