// Áreas musculares disponíveis para filtro
export type AreaMuscular =
    | "Peito"
    | "Tríceps"
    | "Bíceps"
    | "Costas"
    | "Ombro"
    | "Posterior de Coxa"
    | "Quadríceps"
    | "Panturrilha"
    | "Abdômen"

// Tipo de um exercício
export type Exercicio = {
    id: string
    nome: string
    area: AreaMuscular
}

// Tipo de uma ficha de treino
export type Ficha = {
    id: string
    nome: string
    exercicios: Exercicio[]
}

// Um registro de PR (peso máximo) para um exercício numa data específica
export type RegistroPR = {
    id: string
    exercicioId: string
    peso: number
    data: string // ISO date
}
