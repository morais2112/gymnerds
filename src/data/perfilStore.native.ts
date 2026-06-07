import db from "../database/db"
import { Perfil } from "../types"

type PerfilDB = { altura: number | null; idade: number | null }

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

// Le o perfil (linha unica com id=1)
export const getPerfil = (): Perfil => {
    const row = db.getFirstSync<PerfilDB>(
        "SELECT altura, idade FROM perfil_usuario WHERE id = 1"
    )
    if (!row) return { altura: null, idade: null }
    return { altura: row.altura, idade: row.idade }
}

// Salva altura e idade (UPDATE na linha unica)
export const setPerfil = (altura: number | null, idade: number | null) => {
    db.runSync(
        "UPDATE perfil_usuario SET altura = ?, idade = ? WHERE id = 1",
        [altura, idade]
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
