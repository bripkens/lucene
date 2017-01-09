# lucene &nbsp; [![Build Status](https://travis-ci.org/bripkens/lucene.svg?branch=master)](https://travis-ci.org/bripkens/lucene) [![Dependency Status](https://david-dm.org/bripkens/lucene/master.svg)](https://david-dm.org/bripkens/lucene/master) [![Coverage Status](https://img.shields.io/coveralls/bripkens/lucene.svg)](https://coveralls.io/r/bripkens/lucene?branch=master) [![npm version](https://badge.fury.io/js/lucene.svg)](https://badge.fury.io/js/lucene)

Parse, modify and stringify lucene queries.

---

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Usage](#usage)
- [Grammar](#grammar)
- [History](#history)

<!-- /TOC -->

## Installation

```
npm install --save lucene
```

## Usage

```javascript
const lucene = require('lucene');

console.log(lucene.parse('name:frank OR job:engineer'));
// {
//   left: {
//     field: 'name',
//     term: 'frank'
//   },
//   operator: 'OR',
//   right: {
//     field: 'job',
//     term: 'engineer'
//   }
// }
```


## Grammar
The parser is auto-generated from a PEG implementation in JavaScript called [PEG.js](http://pegjs.majda.cz/).

To test the grammar without using the generated parser, or if you want to modify it, try out [PEG.js online](http://pegjs.majda.cz/online). This is a handy way to test arbitrary queries and see what the results will be like or debug a problem with the parser for a given piece of data.


## History
This project is based on [thoward/lucene-query-parser.js](https://github.com/thoward/lucene-query-parser.js) and its forks (most notably [xomyaq/lucene-queryparser](https://github.com/xomyaq/lucene-queryparser)). The project is forked to allow some broader changes to the API surface area, project structure and additional capabilities.
