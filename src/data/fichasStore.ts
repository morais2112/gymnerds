import { Ficha, Exercicio } from "../types"

// Store em memoria com as fichas criadas pelo usuario
// (entre os reloads da tela ela se mantem)
let fichas: Ficha[] = []

// Lista de listeners que sao chamados quando as fichas mudam
type Listener = () => void
const listeners: Listener[] = []

// Notifica todas as telas que estao escutando mudancas
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

// Adiciona um exercicio a uma ficha existente
export const addExercicioNaFicha = (idFicha: string, exercicio: Exercicio) => {
    fichas = fichas.map((f) => {
        if (f.id === idFicha) {
            // evita adicionar o mesmo exercicio duas vezes
            const jaTem = f.exercicios.some((e) => e.id === exercicio.id)
            if (jaTem) return f
            return { ...f, exercicios: [...f.exercicios, exercicio] }
        }
        return f
    })
    notificar()
}

// Inscreve uma tela para receber notificacoes
export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
