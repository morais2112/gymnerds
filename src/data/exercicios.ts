import { AreaMuscular, Exercicio } from "../types"

// Array com os exercícios disponíveis na academia
export const exercicios: Exercicio[] = [
    // Peito
    { id: "1", nome: "Supino Reto", area: "Peito" },
    { id: "2", nome: "Supino Inclinado", area: "Peito" },
    { id: "3", nome: "Crucifixo", area: "Peito" },
    { id: "4", nome: "Crossover", area: "Peito" },

    // Tríceps
    { id: "5", nome: "Tríceps Pulley", area: "Tríceps" },
    { id: "6", nome: "Tríceps Francês", area: "Tríceps" },
    { id: "7", nome: "Tríceps Testa", area: "Tríceps" },
    { id: "8", nome: "Mergulho no Banco", area: "Tríceps" },

    // Bíceps
    { id: "9", nome: "Rosca Direta", area: "Bíceps" },
    { id: "10", nome: "Rosca Alternada", area: "Bíceps" },
    { id: "11", nome: "Rosca Martelo", area: "Bíceps" },
    { id: "12", nome: "Rosca Scott", area: "Bíceps" },

    // Costas
    { id: "13", nome: "Puxada Frontal", area: "Costas" },
    { id: "14", nome: "Remada Curvada", area: "Costas" },
    { id: "15", nome: "Remada Baixa", area: "Costas" },
    { id: "16", nome: "Barra Fixa", area: "Costas" },

    // Ombro
    { id: "17", nome: "Desenvolvimento", area: "Ombro" },
    { id: "18", nome: "Elevação Lateral", area: "Ombro" },
    { id: "19", nome: "Elevação Frontal", area: "Ombro" },
    { id: "20", nome: "Encolhimento", area: "Ombro" },

    // Posterior de Coxa
    { id: "21", nome: "Stiff", area: "Posterior de Coxa" },
    { id: "22", nome: "Mesa Flexora", area: "Posterior de Coxa" },
    { id: "23", nome: "Cadeira Flexora", area: "Posterior de Coxa" },

    // Quadríceps
    { id: "24", nome: "Agachamento Livre", area: "Quadríceps" },
    { id: "25", nome: "Leg Press", area: "Quadríceps" },
    { id: "26", nome: "Cadeira Extensora", area: "Quadríceps" },
    { id: "27", nome: "Hack", area: "Quadríceps" },

    // Panturrilha
    { id: "28", nome: "Panturrilha em Pé", area: "Panturrilha" },
    { id: "29", nome: "Panturrilha Sentado", area: "Panturrilha" },

    // Abdômen
    { id: "30", nome: "Abdominal Supra", area: "Abdômen" },
    { id: "31", nome: "Abdominal Infra", area: "Abdômen" },
    { id: "32", nome: "Prancha", area: "Abdômen" },
    { id: "33", nome: "Abdominal Oblíquo", area: "Abdômen" },
]

// Lista de áreas musculares para o filtro
export const areasMusculares: AreaMuscular[] = [
    "Peito",
    "Tríceps",
    "Bíceps",
    "Costas",
    "Ombro",
    "Posterior de Coxa",
    "Quadríceps",
    "Panturrilha",
    "Abdômen",
]
