import { SessaoTreino } from "../types"

// Pega so a parte da data (YYYY-MM-DD) ignorando hora
const dataOnly = (iso: string): string => iso.substring(0, 10)

// Quantos dias seguidos treinou (contando hoje ou ontem como ancora)
export const calcularStreak = (sessoes: SessaoTreino[]): number => {
    if (sessoes.length === 0) return 0

    // Conjunto unico de dias treinados
    const datas = new Set<string>(sessoes.map((s) => dataOnly(s.data)))

    let count = 0
    const hoje = new Date()
    hoje.setHours(12, 0, 0, 0) // meio dia para evitar problemas de timezone

    const hojeStr = hoje.toISOString().substring(0, 10)

    // Se nao treinou hoje, comeca contando de ontem
    const cursor = new Date(hoje)
    if (!datas.has(hojeStr)) {
        cursor.setDate(cursor.getDate() - 1)
    }

    while (true) {
        const dStr = cursor.toISOString().substring(0, 10)
        if (datas.has(dStr)) {
            count++
            cursor.setDate(cursor.getDate() - 1)
        } else {
            break
        }
    }

    return count
}

// Quantos treinos diferentes esta semana (domingo a sabado)
export const calcularQtdSemana = (sessoes: SessaoTreino[]): number => {
    if (sessoes.length === 0) return 0

    const hoje = new Date()
    hoje.setHours(12, 0, 0, 0)
    // Volta ate o domingo
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - hoje.getDay())
    const inicioStr = inicioSemana.toISOString().substring(0, 10)
    const hojeStr = hoje.toISOString().substring(0, 10)

    // Dias unicos da semana com treino
    const datasUnicas = new Set<string>()
    for (const s of sessoes) {
        const d = dataOnly(s.data)
        if (d >= inicioStr && d <= hojeStr) {
            datasUnicas.add(d)
        }
    }
    return datasUnicas.size
}
