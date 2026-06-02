// Barrel - apenas para TypeScript resolver os tipos.
// Em runtime, o Metro Bundler escolhe:
//   - fichasStore.native.ts  para iOS/Android (SQLite)
//   - fichasStore.web.ts     para navegador (em memoria)
export * from "./fichasStore.native"
