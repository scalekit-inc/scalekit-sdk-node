// Jest transform for the ES-module-only dependencies Jest loads as CommonJS
// (jose, see transformIgnorePatterns in jest.config.js). It converts ES module
// syntax to CommonJS and keeps everything else native (ES2022), so class fields
// are not down-levelled: jose's error constructors (`super(...), this.x = ...`)
// break when they are. ts-jest is not used here because it shares one compiler
// configuration between all of its transform entries.
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

module.exports = {
  process(sourceText, sourcePath) {
    const { outputText } = ts.transpileModule(sourceText, {
      compilerOptions,
      fileName: sourcePath,
    });
    return { code: outputText };
  },
  getCacheKey(sourceText, sourcePath) {
    return `${ts.version}\0${sourcePath}\0${sourceText}`;
  },
};
