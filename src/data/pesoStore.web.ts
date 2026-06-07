import { RegistroPeso } from "../types"

let registros: RegistroPeso[] = []

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

export const getRegistros = (): RegistroPeso[] => {
    return [...registros].sort((a, b) => b.data.localeCompare(a.data))
}

export const getPesoAtual = (): number | null => {
    const lista = getRegistros()
    return lista.length > 0 ? lista[0].peso : null
}

export const getPesoInicial = (): number | null => {
    const lista = [...registros].sort((a, b) => a.data.localeCompare(b.data))
    return lista.length > 0 ? lista[0].peso : null
}

export const addRegistro = (registro: RegistroPeso) => {
    registros = [...registros, registro]
    notificar()
}

export const removeRegistro = (id: string) => {
    registros = registros.filter((r) => r.id !== id)
    notificar()
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
