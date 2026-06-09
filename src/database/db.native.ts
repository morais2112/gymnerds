import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabaseSync("academia.db")

export const initDatabase = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS fichas (
            id TEXT PRIMARY KEY NOT NULL,
            nome TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS ficha_exercicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_ficha TEXT NOT NULL,
            id_exercicio TEXT NOT NULL,
            series INTEGER NOT NULL DEFAULT 3,
            repeticoes INTEGER NOT NULL DEFAULT 10
        );

        CREATE TABLE IF NOT EXISTS registros_pr (
            id TEXT PRIMARY KEY NOT NULL,
            id_exercicio TEXT NOT NULL,
            peso REAL NOT NULL,
            data TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pesos_usuario (
            id TEXT PRIMARY KEY NOT NULL,
            peso REAL NOT NULL,
            data TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS perfil_usuario (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            altura REAL,
            idade INTEGER
        );

        CREATE TABLE IF NOT EXISTS sessoes_treino (
            id TEXT PRIMARY KEY NOT NULL,
            id_ficha TEXT NOT NULL,
            nome_ficha TEXT NOT NULL,
            data TEXT NOT NULL,
            duracao_min INTEGER NOT NULL DEFAULT 60
        );
    `)

    db.runSync("INSERT OR IGNORE INTO perfil_usuario (id, altura, idade) VALUES (1, NULL, NULL)")

    try {
        db.execSync(
            "ALTER TABLE ficha_exercicios ADD COLUMN series INTEGER NOT NULL DEFAULT 3"
        )
    } catch (e) {}
    try {
        db.execSync(
            "ALTER TABLE ficha_exercicios ADD COLUMN repeticoes INTEGER NOT NULL DEFAULT 10"
        )
    } catch (e) {}
}

export default db
