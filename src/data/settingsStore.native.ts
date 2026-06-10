import db from "../database/db"
import { ThemeMode } from "../theme/colors"

type SettingsDB = { tema: string }

// Garante que a tabela existe (chamada na inicializacao)
export const initSettings = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            tema TEXT NOT NULL DEFAULT 'dark'
        );
    `)
    db.runSync(
        "INSERT OR IGNORE INTO settings (id, tema) VALUES (1, 'dark')"
    )
}

export const getTema = (): ThemeMode => {
    try {
        const row = db.getFirstSync<SettingsDB>(
            "SELECT tema FROM settings WHERE id = 1"
        )
        return row?.tema === "light" ? "light" : "dark"
    } catch (e) {
        return "dark"
    }
}

export const setTema = (tema: ThemeMode) => {
    db.runSync("UPDATE settings SET tema = ? WHERE id = 1", [tema])
}
