// Jest transform for the ES-module-only dependencies Jest loads as CommonJS
// (jose, see transformIgnorePatterns in jest.config.js). It converts ES module
// syntax to CommonJS and keeps everything else native (ES2022), so class fields
// are not down-levelled: jose's error constructors (`super(...), this.x = ...`)
// break when they are. ts-jest is not used here because it shares one compiler
// configuration between all of its transform entries.
//
// jest.config.js maps every `.js` file to this transform, but only jose reaches
// it: tests/ has no `.js` files, and transformIgnorePatterns admits only jose
// from node_modules. Revisit this file if either changes.
'use strict';

const ts = require('typescript');

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
  allowJs: true,
  sourceMap: false,
  inlineSourceMap: true,
  inlineSources: true,
};

// Part of every cache key, so editing the options invalidates Jest's cache.
const cacheKeyPrefix = `${ts.version}\0${JSON.stringify(compilerOptions)}`;

module.exports = {
  process(sourceText, sourcePath) {
    const { outputText } = ts.transpileModule(sourceText, {
      compilerOptions,
      fileName: sourcePath,
    });
    return { code: outputText };
  },
  getCacheKey(sourceText, sourcePath) {
    return `${cacheKeyPrefix}\0${sourcePath}\0${sourceText}`;
  },
};
