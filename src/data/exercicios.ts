import { AreaMuscular, Exercicio } from "../types"

// Array com os exercicios disponiveis na academia
export const exercicios: Exercicio[] = [
    // Peito
    { id: "1", nome: "Supino Reto", area: "Peito" },
    { id: "2", nome: "Supino Inclinado", area: "Peito" },
    { id: "3", nome: "Supino Declinado", area: "Peito" },
    { id: "4", nome: "Supino com Halteres", area: "Peito" },
    { id: "5", nome: "Crucifixo Reto", area: "Peito" },
    { id: "6", nome: "Crucifixo Inclinado", area: "Peito" },
    { id: "7", nome: "Crossover", area: "Peito" },
    { id: "8", nome: "Peck Deck", area: "Peito" },
    { id: "9", nome: "Flexao de Braco", area: "Peito" },
    { id: "10", nome: "Pullover", area: "Peito" },

    // Triceps
    { id: "11", nome: "Triceps Pulley Corda", area: "Triceps" },
    { id: "12", nome: "Triceps Pulley Barra", area: "Triceps" },
    { id: "13", nome: "Triceps Frances", area: "Triceps" },
    { id: "14", nome: "Triceps Testa", area: "Triceps" },
    { id: "15", nome: "Triceps Coice", area: "Triceps" },
    { id: "16", nome: "Mergulho no Banco", area: "Triceps" },
    { id: "17", nome: "Mergulho nas Paralelas", area: "Triceps" },
    { id: "18", nome: "Supino Fechado", area: "Triceps" },

    // Biceps
    { id: "19", nome: "Rosca Direta", area: "Biceps" },
    { id: "20", nome: "Rosca Alternada", area: "Biceps" },
    { id: "21", nome: "Rosca Martelo", area: "Biceps" },
    { id: "22", nome: "Rosca Scott", area: "Biceps" },
    { id: "23", nome: "Rosca Concentrada", area: "Biceps" },
    { id: "24", nome: "Rosca 21", area: "Biceps" },
    { id: "25", nome: "Rosca Inversa", area: "Biceps" },
    { id: "26", nome: "Rosca no Cabo", area: "Biceps" },

    // Costas
    { id: "27", nome: "Puxada Frontal", area: "Costas" },
    { id: "28", nome: "Puxada Atras", area: "Costas" },
    { id: "29", nome: "Pulldown Triangulo", area: "Costas" },
    { id: "30", nome: "Remada Curvada", area: "Costas" },
    { id: "31", nome: "Remada Baixa", area: "Costas" },
    { id: "32", nome: "Remada Cavalinho", area: "Costas" },
    { id: "33", nome: "Remada Unilateral", area: "Costas" },
    { id: "34", nome: "Barra Fixa", area: "Costas" },
    { id: "35", nome: "Levantamento Terra", area: "Costas" },
    { id: "36", nome: "Hiperextensao Lombar", area: "Costas" },

    // Ombro
    { id: "37", nome: "Desenvolvimento Militar", area: "Ombro" },
    { id: "38", nome: "Desenvolvimento Arnold", area: "Ombro" },
    { id: "39", nome: "Desenvolvimento Maquina", area: "Ombro" },
    { id: "40", nome: "Elevacao Lateral", area: "Ombro" },
    { id: "41", nome: "Elevacao Frontal", area: "Ombro" },
    { id: "42", nome: "Elevacao Posterior", area: "Ombro" },
    { id: "43", nome: "Encolhimento", area: "Ombro" },
    { id: "44", nome: "Crucifixo Inverso", area: "Ombro" },
    { id: "45", nome: "Remada Alta", area: "Ombro" },
    { id: "46", nome: "Face Pull", area: "Ombro" },

    // Posterior de Coxa
    { id: "47", nome: "Stiff", area: "Posterior de Coxa" },
    { id: "48", nome: "Mesa Flexora", area: "Posterior de Coxa" },
    { id: "49", nome: "Cadeira Flexora", area: "Posterior de Coxa" },
    { id: "50", nome: "Flexora em Pe", area: "Posterior de Coxa" },
    { id: "51", nome: "Levantamento Romeno", area: "Posterior de Coxa" },
    { id: "52", nome: "Bom Dia", area: "Posterior de Coxa" },
    { id: "53", nome: "Avanco Posterior", area: "Posterior de Coxa" },

    // Quadriceps
    { id: "54", nome: "Agachamento Livre", area: "Quadriceps" },
    { id: "55", nome: "Agachamento Smith", area: "Quadriceps" },
    { id: "56", nome: "Agachamento Bulgaro", area: "Quadriceps" },
    { id: "57", nome: "Agachamento Frontal", area: "Quadriceps" },
    { id: "58", nome: "Leg Press 45", area: "Quadriceps" },
    { id: "59", nome: "Leg Press Horizontal", area: "Quadriceps" },
    { id: "60", nome: "Cadeira Extensora", area: "Quadriceps" },
    { id: "61", nome: "Hack Machine", area: "Quadriceps" },
    { id: "62", nome: "Avanco", area: "Quadriceps" },
    { id: "63", nome: "Passada", area: "Quadriceps" },

    // Panturrilha
    { id: "64", nome: "Panturrilha em Pe", area: "Panturrilha" },
    { id: "65", nome: "Panturrilha Sentado", area: "Panturrilha" },
    { id: "66", nome: "Panturrilha no Leg Press", area: "Panturrilha" },
    { id: "67", nome: "Panturrilha Unilateral", area: "Panturrilha" },
    { id: "68", nome: "Burrinho na Maquina", area: "Panturrilha" },

    // Abdomen
    { id: "69", nome: "Abdominal Supra", area: "Abdomen" },
    { id: "70", nome: "Abdominal Infra", area: "Abdomen" },
    { id: "71", nome: "Abdominal Obliquo", area: "Abdomen" },
    { id: "72", nome: "Abdominal Maquina", area: "Abdomen" },
    { id: "73", nome: "Prancha", area: "Abdomen" },
    { id: "74", nome: "Prancha Lateral", area: "Abdomen" },
    { id: "75", nome: "Russian Twist", area: "Abdomen" },
    { id: "76", nome: "Elevacao de Pernas", area: "Abdomen" },
    { id: "77", nome: "Cross Over Crunch", area: "Abdomen" },
    { id: "78", nome: "Bicicleta no Ar", area: "Abdomen" },
]

// Lista de areas musculares para o filtro
export const areasMusculares: AreaMuscular[] = [
    "Peito",
    "Triceps",
    "Biceps",
    "Costas",
    "Ombro",
    "Posterior de Coxa",
    "Quadriceps",
    "Panturrilha",
    "Abdomen",
]
