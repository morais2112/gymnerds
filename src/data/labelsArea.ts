import { AreaMuscular } from "../types"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ComponentProps } from "react"

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
        Cardio: "Cardio",
        Esportes: "Esportes",
    }
    return labels[area]
}

// Mapeia cada area para um icone tematico do MaterialCommunityIcons
export const iconArea = (area: AreaMuscular): IconName => {
    const icones: Record<AreaMuscular, IconName> = {
        Peito: "weight-lifter",
        Triceps: "arm-flex-outline",
        Biceps: "arm-flex",
        Costas: "human-handsdown",
        Ombro: "dumbbell",
        "Posterior de Coxa": "walk",
        Quadriceps: "run",
        Panturrilha: "shoe-sneaker",
        Abdomen: "meditation",
        Cardio: "heart-pulse",        // batimentos cardiacos
        Esportes: "soccer",           // bola de futebol
    }
    return icones[area]
}
