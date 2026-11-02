'use strict';
// Jest transform for the ES-module-only `jose` package, which tests load from
// src/ (the published build bundles it instead; see scripts/bundle-jose.js).
// It converts ES modules to CommonJS with an ES2022 target: downlevelling
// class fields breaks jose's error classes. ts-jest is not used here because
// it applies the TypeScript config (target ES6) to every file it transforms.
const crypto = require('node:crypto');
const fs = require('node:fs');
const ts = require('typescript');

const SELF = fs.readFileSync(__filename);

module.exports = {
  getCacheKey(sourceText, sourcePath) {
    return crypto
      .createHash('sha256')
      .update(SELF)
      .update(ts.version)
      .update(sourcePath)
      .update(sourceText)
      .digest('hex');
  },
  process(sourceText, sourcePath) {
    const { outputText, sourceMapText } = ts.transpileModule(sourceText, {
      fileName: sourcePath,
      compilerOptions: {
        allowJs: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        sourceMap: true,
      },
    });
    return { code: outputText, map: sourceMapText };
  },
};
