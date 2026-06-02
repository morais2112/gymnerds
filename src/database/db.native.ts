// Versao NATIVA (iOS / Android) - usa SQLite real
import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabaseSync("academia.db")

// Inicializa as tabelas + migracoes
export const initDatabase = () => {
    // execSync - cria as tabelas se nao existirem (Aula 7)
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
    `)

    // Migracao: se o usuario ja tinha o banco com a versao antiga,
    // adiciona as colunas series e repeticoes (ignora se ja existem)
    try {
        db.execSync(
            "ALTER TABLE ficha_exercicios ADD COLUMN series INTEGER NOT NULL DEFAULT 3"
        )
    } catch (e) {
        // coluna ja existe - tudo ok
    }
    try {
        db.execSync(
            "ALTER TABLE ficha_exercicios ADD COLUMN repeticoes INTEGER NOT NULL DEFAULT 10"
        )
    } catch (e) {
        // coluna ja existe - tudo ok
    }
}

export default db
