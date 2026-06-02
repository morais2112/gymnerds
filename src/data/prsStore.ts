// Barrel - apenas para TypeScript resolver os tipos.
// Em runtime, o Metro Bundler escolhe:
//   - prsStore.native.ts  para iOS/Android (SQLite)
//   - prsStore.web.ts     para navegador (em memoria)
export * from "./prsStore.native"
