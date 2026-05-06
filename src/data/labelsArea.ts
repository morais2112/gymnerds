import { AreaMuscular } from "../types"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ComponentProps } from "react"

// Tipo do nome de icone do MaterialCommunityIcons (tem mais opcoes anatomicas)
export type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"]

// Mapeia o id interno (sem acento) para o label exibido (com acento)
export const labelArea = (area: AreaMuscular): string => {
    const labels: Record<AreaMuscular, string> = {
        Peito: "Peito",
        Triceps: "Tríceps",
        Biceps: "Bíceps",
        Costas: "Costas",
        Ombro: "Ombro",
        "Posterior de Coxa": "Posterior de Coxa",
        Quadriceps: "Quadríceps",
        Panturrilha: "Panturrilha",
        Abdomen: "Abdômen",
    }
    return labels[area]
}

// Mapeia cada area para um icone mais tematico do MaterialCommunityIcons
export const iconArea = (area: AreaMuscular): IconName => {
    const icones: Record<AreaMuscular, IconName> = {
        Peito: "weight-lifter",          // pessoa fazendo supino
        Triceps: "arm-flex-outline",     // braco flexionado (contorno - parte de tras)
        Biceps: "arm-flex",              // braco flexionado (cheio - parte da frente)
        Costas: "human-handsdown",       // pessoa de costas
        Ombro: "dumbbell",               // halter (elevacao lateral)
        "Posterior de Coxa": "walk",     // andar (ativa posterior)
        Quadriceps: "run",               // correr (ativa quadriceps)
        Panturrilha: "shoe-sneaker",     // tenis (panturrilha logo acima)
        Abdomen: "meditation",           // postura que engaja o core
    }
    return icones[area]
}
