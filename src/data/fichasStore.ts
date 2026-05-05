import { Ficha, Exercicio } from "../types"

// Store em memória com as fichas criadas pelo usuário
// (entre os reloads da tela ela se mantém)
let fichas: Ficha[] = []

// Lista de listeners que são chamados quando as fichas mudam
type Listener = () => void
const listeners: Listener[] = []

// Notifica todas as telas que estão escutando mudanças
const notificar = () => {
    listeners.forEach((l) => l())
}

// Retorna todas as fichas
export const getFichas = (): Ficha[] => {
    return fichas
}

// Adiciona uma ficha nova
export const addFicha = (ficha: Ficha) => {
    fichas = [...fichas, ficha]
    notificar()
}

// Remove uma ficha pelo id
export const removeFicha = (id: string) => {
    fichas = fichas.filter((f) => f.id !== id)
    notificar()
}

// Adiciona um exercício a uma ficha existente
export const addExercicioNaFicha = (idFicha: string, exercicio: Exercicio) => {
    fichas = fichas.map((f) => {
        if (f.id === idFicha) {
            // Evita adicionar o mesmo exercício duas vezes
            const jaTem = f.exercicios.some((e) => e.id === exercicio.id)
            if (jaTem) return f
            return { ...f, exercicios: [...f.exercicios, exercicio] }
        }
        return f
    })
    notificar()
}

// Inscreve uma tela para receber notificações
export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
