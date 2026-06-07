import db from "../database/db"
import { RegistroPeso } from "../types"

type RegistroPesoDB = {
    id: string
    peso: number
    data: string
}

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

// Retorna todos os registros ordenados do mais recente para o mais antigo
export const getRegistros = (): RegistroPeso[] => {
    return db.getAllSync<RegistroPesoDB>(
        "SELECT * FROM pesos_usuario ORDER BY data DESC"
    )
}

// Peso atual = registro mais recente
export const getPesoAtual = (): number | null => {
    const row = db.getFirstSync<RegistroPesoDB>(
        "SELECT * FROM pesos_usuario ORDER BY data DESC LIMIT 1"
    )
    return row ? row.peso : null
}

// Peso inicial = registro mais antigo (para calcular variacao)
export const getPesoInicial = (): number | null => {
    const row = db.getFirstSync<RegistroPesoDB>(
        "SELECT * FROM pesos_usuario ORDER BY data ASC LIMIT 1"
    )
    return row ? row.peso : null
}

export const addRegistro = (registro: RegistroPeso) => {
    db.runSync(
        "INSERT INTO pesos_usuario (id, peso, data) VALUES (?, ?, ?)",
        [registro.id, registro.peso, registro.data]
    )
    notificar()
}

export const removeRegistro = (id: string) => {
    db.runSync("DELETE FROM pesos_usuario WHERE id = ?", [id])
    notificar()
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
