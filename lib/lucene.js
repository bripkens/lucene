'use strict';

const queryParser = require('./queryParser');

exports.parse = s => queryParser.parse(s);
exports.toString = require('./toString');
