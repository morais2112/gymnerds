// Barrel - apenas para TypeScript resolver os tipos.
// Em runtime, o Metro Bundler escolhe:
//   - db.native.ts  para iOS/Android
//   - db.web.ts     para navegador
export * from "./db.native"
export { default } from "./db.native"
