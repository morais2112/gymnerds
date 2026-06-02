// Versao WEB - em memoria (SQLite nao roda no browser)
import { RegistroPR } from "../types"

// Mesma API que a versao native, mas armazena tudo em array
let registros: RegistroPR[] = []

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

export const getRegistros = (): RegistroPR[] => {
    return [...registros].sort((a, b) => b.data.localeCompare(a.data))
}

export const getRegistrosDoExercicio = (exercicioId: string): RegistroPR[] => {
    return registros
        .filter((r) => r.exercicioId === exercicioId)
        .sort((a, b) => b.data.localeCompare(a.data))
}

export const getPRAtual = (exercicioId: string): number | null => {
    const lista = registros.filter((r) => r.exercicioId === exercicioId)
    if (lista.length === 0) return null
    return Math.max(...lista.map((r) => r.peso))
}

export const addRegistro = (registro: RegistroPR) => {
    registros = [...registros, registro]
    notificar()
}

export const removeRegistro = (id: string) => {
    registros = registros.filter((r) => r.id !== id)
    notificar()
}

export const getExerciciosComPR = (): string[] => {
    const ids = new Set(registros.map((r) => r.exercicioId))
    return Array.from(ids)
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
