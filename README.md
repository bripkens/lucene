# Lucene Query Parser for JavaScript

This is an implementation of the Lucene Query Parser developed using PEG.js.

## Example

A quick example of how to use it:

```javascript
var parser = require('lucene-queryparser');

// return the expression tree
var results = parser.parse('title:"The Right Way" AND text:go');

console.log(results['left']['field']);      // title
console.log(results['left']['term']);       // The Right Way
console.log(results['operator']);           // AND
console.log(results['right']['field']);     // text
console.log(results['right']['term']);      // go
```

A slightly more complicated example:

```javascript
var parser = require('lucene-queryparser');

// return the expression tree
var results = parser.parse('test AND (foo OR bar)');

console.log(results['left']['term']);       // test
console.log(results['operator']);           // AND

// the grouped expression in parentheses becomes it's own nested node
var rightNode = results['right'];

console.log(rightNode['left']['term']);     // foo
console.log(rightNode['operator']);         // OR
console.log(rightNode['right']['term']);    // bar
```

## Installation

### On the Command-Line

The library is available as an npm module.

To install, run:

```
npm install lucene-queryparser
```

## Unit Tests

Unit tests are built with [Jasmine](http://pivotal.github.com/jasmine/).

### On the Command-line

To run the unit tests on the command line, using node:

```
npm test
```

## Grammar

The parser is auto-generated from a PEG implementation in Javascript called [PEG.js](http://pegjs.majda.cz/).

To test the grammar without using the generated parser, or if you want to modify it, try out [PEG.js online](http://pegjs.majda.cz/online>). This is a handy way to test an abritrary query and see what the results will be like or debug a problem with the parser for a given piece of data.
