'use strict';

const expect = require('chai').expect;

const lucene = require('../');

describe('escaping', () => {
  describe('escape', () => {
    it('must not escape when not necessary', () => {
      expect(lucene.term.escape('foo')).to.equal('foo');
      expect(lucene.term.escape('>32')).to.equal('>32');
    });

    it('must escape typical reserved characters', () => {
      expect(lucene.term.escape('[32]')).to.equal('\\[32\\]');
      expect(lucene.term.escape('foo:bar')).to.equal('foo\\:bar');
    });

    it('must escape phrases', () => {
      expect(lucene.phrase.escape('foo"bar')).to.equal('foo\\"bar');
    });

    it('must escape line breaks', () => {
      expect(lucene.term.escape('a\nb')).to.equal('a\\\nb');
    });
  });

  describe('unescape', () => {
    it('must not escape when not necessary', () => {
      expect(lucene.term.unescape('foo')).to.equal('foo');
      expect(lucene.term.unescape('>32')).to.equal('>32');
    });

    it('must escape typical reserved characters', () => {
      expect(lucene.term.unescape('\\[32\\]')).to.equal('[32]');
      expect(lucene.term.unescape('foo\\:bar')).to.equal('foo:bar');
    });

    it('must unescape phrases', () => {
      expect(lucene.phrase.unescape('foo\\"bar')).to.equal('foo"bar');
    });

    it('must unescape line breaks', () => {
      expect(lucene.term.unescape('a\\\nb')).to.equal('a\nb');
    });
  });
});
