# TIP-081A build2 — retained failure evidence

2026-10-06. Owner-approved final existing build slot,600s maximum.
Exact root /private/tmp/hiveos-tip081-shadow-U10rGb. PhaseNEXT_BUILD.
Next16.2.11 webpack, fixed preserve-symlinks flags; write confinement to exact
owned shadow and forbidden p139 attempt5 read denial. No provider/replay.

Actual terminal excerpt (repeated for app-next, global-error, client-page and
client-segment modules as well):

```text
Failed to compile.

../../../Users/os/hiveos/node_modules/next/dist/client/app-dir/link.js
Error: bindings not loaded yet.  Either call `loadBindings` to wait for them to be available or ensure that `installBindings` has already been called.
    at getBindingsSync (/Users/os/hiveos/node_modules/next/dist/build/swc/index.js:238:37)
    at /Users/os/hiveos/node_modules/next/dist/build/webpack/loaders/next-swc-loader.js:221:195
    at Object.pitch (/Users/os/hiveos/node_modules/next/dist/build/webpack/loaders/next-swc-loader.js:225:7)

Import trace for requested module:
../../../Users/os/hiveos/node_modules/next/dist/client/app-dir/link.js

> Build failed because of webpack errors
{"phase":"NEXT_BUILD","durationMilliseconds":15156.71125,"limitMilliseconds":600000,"status":1,"signal":null,"errorCode":null}
```

Read-only module resolution diagnostic (no SWC module loaded):

```json
{"shadowSwc":"/private/tmp/hiveos-tip081-shadow-U10rGb/node_modules/next/dist/build/swc/index.js","realLoaderSwc":"/Users/os/hiveos/node_modules/next/dist/build/swc/index.js","sameModuleId":false}
```

Installedsource SWC caches loadedBindings/pendingBindings per module instance;
loader pitch calls getBindingsSync before normal loader installBindings. The
build error names realpath-loader SWC while preserved CLI uses shadow paths.
Dual module identity is a source-supported diagnosis, not independently replayed
causal confirmation. Do not treat this as missing mathematical evidence or
missing SWC binaries, and do not install dependencies on that assumption.

Both authorized build slots consumed. No third build/dev-server workaround,
packaging or3004start, E2E/browser/model/math effects. Preserve both failed roots.
