'use strict';

const queryParser = require('./queryParser');

exports.parse = queryParser.parse.bind(queryParser);
exports.toString = require('./toString');
