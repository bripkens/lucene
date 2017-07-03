'use strict';

var queryParser = require('./queryParser');

exports.parse = queryParser.parse.bind(queryParser);
exports.toString = require('./toString');
