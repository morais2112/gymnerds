// Areas musculares disponiveis para filtro
// (sem acento nos identificadores; o label com acento vem de labelsArea)
export type AreaMuscular =
    | "Peito"
    | "Triceps"
    | "Biceps"
    | "Costas"
    | "Ombro"
    | "Posterior de Coxa"
    | "Quadriceps"
    | "Panturrilha"
    | "Abdomen"

// Tipo de um exercicio (catalogo geral)
export type Exercicio = {
    id: string
    nome: string
    area: AreaMuscular
}

// Tipo de um exercicio DENTRO de uma ficha (com series e repeticoes)
export type ExercicioFicha = {
    exercicio: Exercicio
    series: number
    repeticoes: number
}

// Tipo de uma ficha de treino
export type Ficha = {
    id: string
    nome: string
    exercicios: ExercicioFicha[]
}

// Um registro de PR (peso maximo) para um exercicio numa data especifica
export type RegistroPR = {
    id: string
    exercicioId: string
    peso: number
    data: string // ISO date
}
