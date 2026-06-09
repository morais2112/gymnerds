import db from "../database/db"
import { SessaoTreino } from "../types"

type SessaoDB = {
    id: string
    id_ficha: string
    nome_ficha: string
    data: string
    duracao_min: number
}

type Listener = () => void
const listeners: Listener[] = []
const notificar = () => listeners.forEach((l) => l())

const mapRow = (r: SessaoDB): SessaoTreino => ({
    id: r.id,
    idFicha: r.id_ficha,
    nomeFicha: r.nome_ficha,
    data: r.data,
    duracaoMin: r.duracao_min,
})

export const getSessoes = (): SessaoTreino[] => {
    const rows = db.getAllSync<SessaoDB>(
        "SELECT * FROM sessoes_treino ORDER BY data DESC"
    )
    return rows.map(mapRow)
}

// Sessoes de um mes especifico (ano + mes 1-12)
export const getSessoesMes = (ano: number, mes: number): SessaoTreino[] => {
    const mesStr = String(mes).padStart(2, "0")
    const inicio = `${ano}-${mesStr}-01`
    const fim = `${ano}-${mesStr}-32`  // truque que pega tudo do mes
    const rows = db.getAllSync<SessaoDB>(
        "SELECT * FROM sessoes_treino WHERE data >= ? AND data < ? ORDER BY data ASC",
        [inicio, fim]
    )
    return rows.map(mapRow)
}

export const addSessao = (sessao: SessaoTreino) => {
    db.runSync(
        "INSERT INTO sessoes_treino (id, id_ficha, nome_ficha, data, duracao_min) VALUES (?, ?, ?, ?, ?)",
        [sessao.id, sessao.idFicha, sessao.nomeFicha, sessao.data, sessao.duracaoMin]
    )
    notificar()
}

export const removeSessao = (id: string) => {
    db.runSync("DELETE FROM sessoes_treino WHERE id = ?", [id])
    notificar()
}

export const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener)
    return () => {
        const i = listeners.indexOf(listener)
        if (i >= 0) listeners.splice(i, 1)
    }
}
