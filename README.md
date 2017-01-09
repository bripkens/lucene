# Lucene Query Parsing and Formatting for JavaScript

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
