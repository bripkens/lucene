'use strict';

const expect = require('chai').expect;

const StringStream = require('../../lib/lexer/StringStream');

describe.only('StringStream', () => {
  let stream;

  beforeEach(() => {
    stream = new StringStream('hello');
  });

  describe('next', () => {
    it('must step through the input string', () => {
      expect(stream.next()).to.equal('h');
      expect(stream.next()).to.equal('e');
      expect(stream.next()).to.equal('l');
      expect(stream.next()).to.equal('l');
      expect(stream.next()).to.equal('o');
    });

    it('must return null when the stream is exhausted', () => {
      stream.skipToEnd();
      expect(stream.next()).to.equal(null);
    });
  });

  describe('hasNext', () => {
    it('must return false when the source is consumed', () => {
      stream.skipToEnd();
      expect(stream.hasNext()).to.equal(false);
    });

    it('must return true when the source has not been consumed', () => {
      stream.next();
      expect(stream.hasNext()).to.equal(true);
    });
  });

  describe('peek', () => {
    it('must check the next value without advancing the stream', () => {
      expect(stream.peek()).to.equal('h');
      expect(stream.peek()).to.equal('h');
    });

    it('must return null when the stream is exhausted', () => {
      stream.skipToEnd();
      expect(stream.next()).to.equal(null);
    });
  });

  describe('getPosition', () => {
    it('must start at 0', () => {
      expect(stream.getPosition()).to.equal(0);
    });

    it('must update column information when calling next()', () => {
      stream.next();
      expect(stream.getPosition()).to.equal(1);
      stream.next();
      expect(stream.getPosition()).to.equal(2);
    });
  });

  describe('eatWhile', () => {
    it('must eat the source while truthy', () => {
      expect(stream.eatWhile(/[a-z0-9]/)).to.deep.equal({
        start: 0,
        end: 5,
        lexeme: 'hello'
      });
    });

    it('must eat the source while truthy', () => {
      stream = new StringStream('  ');
      expect(stream.eatWhile(/[a-z0-9]/)).to.deep.equal({
        start: 0,
        end: 0,
        lexeme: ''
      });
    });

    it('must support functions as eat while param', () => {
      stream = new StringStream('helLo');
      expect(stream.eatWhile(c => c.toLowerCase() === c)).to.deep.equal({
        start: 0,
        end: 3,
        lexeme: 'hel'
      });
    });
  });
});
