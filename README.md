# lucene &nbsp; [![Build Status](https://travis-ci.org/bripkens/lucene.svg?branch=master)](https://travis-ci.org/bripkens/lucene) [![Dependency Status](https://david-dm.org/bripkens/lucene/master.svg)](https://david-dm.org/bripkens/lucene/master) [![npm version](https://badge.fury.io/js/lucene.svg)](https://badge.fury.io/js/lucene)

Parse, modify and stringify lucene queries.

---

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

## History
This project is based on [thoward/lucene-query-parser.js](https://github.com/thoward/lucene-query-parser.js) and its forks (most notably [xomyaq/lucene-queryparser](https://github.com/xomyaq/lucene-queryparser)). The project is forked to allow some broader changes to the API surface area, project structure and additional capabilities.
