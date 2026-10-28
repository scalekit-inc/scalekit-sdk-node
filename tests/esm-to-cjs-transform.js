// Jest transform for ESM-only packages in node_modules (jose). It only rewrites
// import/export to CommonJS and keeps modern syntax as is: ts-jest compiles to the
// tsconfig target (ES6), which moves jose's class field initializers ahead of
// super() and breaks its error classes.
const ts = require('typescript');

module.exports = {
  process(sourceText, sourcePath) {
    const { outputText, sourceMapText } = ts.transpileModule(sourceText, {
      fileName: sourcePath,
      compilerOptions: {
        allowJs: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        sourceMap: true,
      },
    });
    return { code: outputText, map: sourceMapText };
  },
  getCacheKey(sourceText, sourcePath) {
    return require('crypto')
      .createHash('sha256')
      .update(`${ts.version}\0${sourcePath}\0${sourceText}`)
      .digest('hex');
  },
};
