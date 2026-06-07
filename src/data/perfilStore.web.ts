import { Perfil } from "../types"

let perfil: Perfil = { altura: null, idade: null }

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

export const getPerfil = (): Perfil => perfil

export const setPerfil = (altura: number | null, idade: number | null) => {
    perfil = { altura, idade }
    notificar()
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
