import ScalekitClient from './scalekit';
import * as namedExports from './exports';

export * from './exports';

// Up to 2.20 the package was CommonJS only. A default import from native Node ESM
// (and TypeScript with `module: nodenext`) therefore received the whole module, so
// callers wrote `new Scalekit.default(...)` or `Scalekit.ConnectionType`. The ESM
// build's default export is the client class itself, which is what bundlers already
// returned. Exposing every named export, and `default`, on the class keeps both forms
// working. The properties are non-enumerable so they do not show up when iterating
// the class.
for (const [name, value] of Object.entries(namedExports)) {
  if (!(name in ScalekitClient)) {
    Object.defineProperty(ScalekitClient, name, { value, enumerable: false });
  }
}
Object.defineProperty(ScalekitClient, 'default', {
  value: ScalekitClient,
  enumerable: false,
});

const DefaultExport = ScalekitClient as typeof ScalekitClient &
  typeof namedExports & { default: typeof ScalekitClient };
// Declared as a type too, so the default import still works as a type
// (`let client: Scalekit`), as it did when the default export was the class.
type DefaultExport = ScalekitClient;

export default DefaultExport;
