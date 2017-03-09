var StringStream = module.exports = exports = function StringStream(source) {
  this.source = source;
  this.position = 0;
};

StringStream.prototype.getPosition = function getPosition() {
  return this.position;
};

StringStream.prototype.next = function next() {
  if (!this.hasNext()) {
    return null;
  }
  return this.source.charAt(this.position++);
};

StringStream.prototype.hasNext = function hasNext() {
  return this.position < this.source.length;
};

StringStream.prototype.peek = function peek() {
  if (!this.hasNext()) {
    return null;
  }
  return this.source.charAt(this.position);
};

StringStream.prototype.skipToEnd = function skipToEnd() {
  this.position = this.source.length;
};

StringStream.prototype.eatWhile = function eatWhile(fn) {
  var result = {
    start: this.position,
    end: this.position,
    lexeme: ''
  };

  if (fn instanceof RegExp) {
    var regexp = fn;
    fn = function checkEatWhile(char) {
      return regexp.test(char);
    };
  }

  while (this.hasNext() && fn(this.peek(), result.lexeme)) {
    result.lexeme += this.next();
  }

  result.end = this.position;

  return result;
};
