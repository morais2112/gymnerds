import { RegistroPR } from "../types"

// Store em memória com os registros de PR
let registros: RegistroPR[] = []

type Listener = () => void
const listeners: Listener[] = []

const notificar = () => {
    listeners.forEach((l) => l())
}

// Retorna todos os registros
export const getRegistros = (): RegistroPR[] => registros

// Retorna os registros de um exercício específico (mais recentes primeiro)
export const getRegistrosDoExercicio = (exercicioId: string): RegistroPR[] => {
    return registros
        .filter((r) => r.exercicioId === exercicioId)
        .sort((a, b) => b.data.localeCompare(a.data))
}

// Retorna o PR atual (maior peso) de um exercício, ou null se não tiver
export const getPRAtual = (exercicioId: string): number | null => {
    const lista = registros.filter((r) => r.exercicioId === exercicioId)
    if (lista.length === 0) return null
    return Math.max(...lista.map((r) => r.peso))
}

// Adiciona um novo registro de PR
export const addRegistro = (registro: RegistroPR) => {
    registros = [...registros, registro]
    notificar()
}

// Remove um registro pelo id
export const removeRegistro = (id: string) => {
    registros = registros.filter((r) => r.id !== id)
    notificar()
}

// Inscreve uma tela para receber notificações de mudança
export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
