import db from "../database/db"
import { Ficha, Exercicio, ExercicioFicha } from "../types"
import { exercicios } from "./exercicios"

type FichaDB = { id: string; nome: string }
type FichaExercicioDB = {
    id_exercicio: string
    series: number
    repeticoes: number
}

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

// Reconstroi os exercicios de uma ficha com suas series e repeticoes
const carregarExerciciosDaFicha = (idFicha: string): ExercicioFicha[] => {
    const rows = db.getAllSync<FichaExercicioDB>(
        "SELECT id_exercicio, series, repeticoes FROM ficha_exercicios WHERE id_ficha = ?",
        [idFicha]
    )
    const result: ExercicioFicha[] = []
    for (const r of rows) {
        const ex = exercicios.find((e) => e.id === r.id_exercicio)
        if (ex) {
            result.push({
                exercicio: ex,
                series: r.series,
                repeticoes: r.repeticoes,
            })
        }
    }
    return result
}

export const getFichas = (): Ficha[] => {
    const rows = db.getAllSync<FichaDB>(
        "SELECT id, nome FROM fichas ORDER BY rowid DESC"
    )
    return rows.map((f) => ({
        id: f.id,
        nome: f.nome,
        exercicios: carregarExerciciosDaFicha(f.id),
    }))
}

export const addFicha = (ficha: Ficha) => {
    db.runSync("INSERT OR REPLACE INTO fichas (id, nome) VALUES (?, ?)", [
        ficha.id,
        ficha.nome,
    ])
    db.runSync("DELETE FROM ficha_exercicios WHERE id_ficha = ?", [ficha.id])
    for (const ex of ficha.exercicios) {
        db.runSync(
            "INSERT INTO ficha_exercicios (id_ficha, id_exercicio, series, repeticoes) VALUES (?, ?, ?, ?)",
            [ficha.id, ex.exercicio.id, ex.series, ex.repeticoes]
        )
    }
    notificar()
}

export const removeFicha = (id: string) => {
    db.runSync("DELETE FROM ficha_exercicios WHERE id_ficha = ?", [id])
    db.runSync("DELETE FROM fichas WHERE id = ?", [id])
    notificar()
}

// Agora recebe series e repeticoes
export const addExercicioNaFicha = (
    idFicha: string,
    exercicio: Exercicio,
    series: number,
    repeticoes: number
) => {
    // Verifica se ja tem
    const ja = db.getFirstSync<{ id: number }>(
        "SELECT id FROM ficha_exercicios WHERE id_ficha = ? AND id_exercicio = ?",
        [idFicha, exercicio.id]
    )
    if (ja) {
        // Ja existe - atualiza series e repeticoes
        db.runSync(
            "UPDATE ficha_exercicios SET series = ?, repeticoes = ? WHERE id = ?",
            [series, repeticoes, ja.id]
        )
    } else {
        db.runSync(
            "INSERT INTO ficha_exercicios (id_ficha, id_exercicio, series, repeticoes) VALUES (?, ?, ?, ?)",
            [idFicha, exercicio.id, series, repeticoes]
        )
    }
    notificar()
}

// Remove um exercicio especifico de uma ficha
export const removeExercicioDaFicha = (idFicha: string, idExercicio: string) => {
    db.runSync(
        "DELETE FROM ficha_exercicios WHERE id_ficha = ? AND id_exercicio = ?",
        [idFicha, idExercicio]
    )
    notificar()
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
