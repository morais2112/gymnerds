// Versao NATIVA (iOS / Android) - usa SQLite
import db from "../database/db"
import { RegistroPR } from "../types"

type RegistroPRDB = {
    id: string
    id_exercicio: string
    peso: number
    data: string
}

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

const mapRow = (r: RegistroPRDB): RegistroPR => ({
    id: r.id,
    exercicioId: r.id_exercicio,
    peso: r.peso,
    data: r.data,
})

// getAllSync - executa SELECT que retorna varios registros (Aula 7)
export const getRegistros = (): RegistroPR[] => {
    const rows = db.getAllSync<RegistroPRDB>(
        "SELECT * FROM registros_pr ORDER BY data DESC"
    )
    return rows.map(mapRow)
}

export const getRegistrosDoExercicio = (exercicioId: string): RegistroPR[] => {
    const rows = db.getAllSync<RegistroPRDB>(
        "SELECT * FROM registros_pr WHERE id_exercicio = ? ORDER BY data DESC",
        [exercicioId]
    )
    return rows.map(mapRow)
}

// getFirstSync - executa SELECT que retorna um unico registro (Aula 7)
export const getPRAtual = (exercicioId: string): number | null => {
    const row = db.getFirstSync<{ maior: number | null }>(
        "SELECT MAX(peso) as maior FROM registros_pr WHERE id_exercicio = ?",
        [exercicioId]
    )
    if (!row || row.maior === null) return null
    return row.maior
}

// runSync - executa INSERT/UPDATE/DELETE (Aula 7)
export const addRegistro = (registro: RegistroPR) => {
    db.runSync(
        "INSERT INTO registros_pr (id, id_exercicio, peso, data) VALUES (?, ?, ?, ?)",
        [registro.id, registro.exercicioId, registro.peso, registro.data]
    )
    notificar()
}

export const removeRegistro = (id: string) => {
    db.runSync("DELETE FROM registros_pr WHERE id = ?", [id])
    notificar()
}

export const getExerciciosComPR = (): string[] => {
    const rows = db.getAllSync<{ id_exercicio: string }>(
        "SELECT DISTINCT id_exercicio FROM registros_pr"
    )
    return rows.map((r) => r.id_exercicio)
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
