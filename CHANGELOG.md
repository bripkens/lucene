# Changelog

## 1.3.0
 - Support whitespace between colon and term.
 - Include offset information.

## 1.2.0
 - Support mixed inclusive/exclusive range delimiters

## 1.1.3
 - Fix malformed `toString` output when using paranthesis.

## 1.1.2
 - Upgrade to pegjs 0.8
 - Support escaped characters in quoted strings.

## 1.1.1
 - Do not require ES2015 features.

## 1.1.0
 - Turn ASTs into queries via `lucene.toString(ast)`.
 - Retain information about quoted strings in the AST.
 - Retain original operators (`&&`, `||`) instead of translating it.

## 1.0.0
 - Initial release
