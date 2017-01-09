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
