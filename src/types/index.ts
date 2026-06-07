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

export type Exercicio = {
    id: string
    nome: string
    area: AreaMuscular
}

export type ExercicioFicha = {
    exercicio: Exercicio
    series: number
    repeticoes: number
}

export type Ficha = {
    id: string
    nome: string
    exercicios: ExercicioFicha[]
}

export type RegistroPR = {
    id: string
    exercicioId: string
    peso: number
    data: string
}

export type RegistroPeso = {
    id: string
    peso: number
    data: string
}

// Perfil do usuario: altura (cm) e idade (anos)
export type Perfil = {
    altura: number | null
    idade: number | null
}

// Classificacao do IMC
export type ClassificacaoIMC =
    | "Abaixo do peso"
    | "Peso normal"
    | "Sobrepeso"
    | "Obesidade grau I"
    | "Obesidade grau II"
    | "Obesidade grau III"
