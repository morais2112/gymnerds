import { Ficha, Exercicio, ExercicioFicha } from "../types"

let fichas: Ficha[] = []

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

export const getFichas = (): Ficha[] => {
    return fichas
}

export const addFicha = (ficha: Ficha) => {
    const idx = fichas.findIndex((f) => f.id === ficha.id)
    if (idx >= 0) {
        fichas = fichas.map((f, i) => (i === idx ? ficha : f))
    } else {
        fichas = [...fichas, ficha]
    }
    notificar()
}

export const removeFicha = (id: string) => {
    fichas = fichas.filter((f) => f.id !== id)
    notificar()
}

export const addExercicioNaFicha = (
    idFicha: string,
    exercicio: Exercicio,
    series: number,
    repeticoes: number
) => {
    fichas = fichas.map((f) => {
        if (f.id !== idFicha) return f
        const idx = f.exercicios.findIndex((e) => e.exercicio.id === exercicio.id)
        if (idx >= 0) {
            // Ja existe - atualiza
            const novos: ExercicioFicha[] = f.exercicios.map((e, i) =>
                i === idx ? { exercicio, series, repeticoes } : e
            )
            return { ...f, exercicios: novos }
        }
        return {
            ...f,
            exercicios: [...f.exercicios, { exercicio, series, repeticoes }],
        }
    })
    notificar()
}

export const removeExercicioDaFicha = (idFicha: string, idExercicio: string) => {
    fichas = fichas.map((f) => {
        if (f.id !== idFicha) return f
        return {
            ...f,
            exercicios: f.exercicios.filter((e) => e.exercicio.id !== idExercicio),
        }
    })
    notificar()
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
