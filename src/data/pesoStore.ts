// Barrel - apenas para TypeScript resolver os tipos.
// Em runtime, o Metro Bundler escolhe:
//   - pesoStore.native.ts  para iOS/Android (SQLite)
//   - pesoStore.web.ts     para navegador (em memoria)
export * from "./pesoStore.native"
