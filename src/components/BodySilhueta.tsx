import Svg, { Circle, Path, Rect } from "react-native-svg"
import { AreaMuscular } from "../types"

// Props tipadas
type BodySilhuetaProps = {
    area: AreaMuscular
    size?: number
    cor?: string       // cor do destaque
    corBase?: string   // cor do corpo nao destacado
}

const BodySilhueta = (props: BodySilhuetaProps) => {
    const size = props.size ?? 40
    const cor = props.cor ?? "#ffffff"
    const corBase = props.corBase ?? "#3a3a48"

    // Helper - retorna a cor de destaque se for a area ativa, senao cor base
    const c = (a: AreaMuscular) => (props.area === a ? cor : corBase)

    return (
        <Svg width={size} height={size * 1.4} viewBox="0 0 100 140">
            {/* Cabeca */}
            <Circle cx={50} cy={13} r={9} fill={corBase} />
            {/* Pescoco */}
            <Rect x={46} y={20} width={8} height={6} fill={corBase} />

            {/* Trapezio / Ombros (acima do peito) */}
            <Path
                d="M 26 28 Q 50 23 74 28 L 72 36 L 28 36 Z"
                fill={c("Ombro")}
            />

            {/* Deltoides - bolinhas nos cantos do ombro */}
            <Circle cx={22} cy={34} r={6} fill={c("Ombro")} />
            <Circle cx={78} cy={34} r={6} fill={c("Ombro")} />

            {/* Peito - dois peitorais */}
            <Path
                d="M 30 36 Q 40 35 49 38 L 49 52 Q 40 54 30 52 Z"
                fill={c("Peito")}
            />
            <Path
                d="M 51 38 Q 60 35 70 36 L 70 52 Q 60 54 51 52 Z"
                fill={c("Peito")}
            />

            {/* Costas - quando ativo, mostra um overlay tipo asas/lats */}
            {props.area === "Costas" && (
                <>
                    <Path d="M 28 38 L 38 38 L 36 64 L 28 60 Z" fill={cor} />
                    <Path d="M 62 38 L 72 38 L 72 60 L 64 64 Z" fill={cor} />
                </>
            )}

            {/* Abdomen - 6-pack estilizado */}
            <Rect x={36} y={54} width={11} height={9} rx={2} fill={c("Abdomen")} />
            <Rect x={53} y={54} width={11} height={9} rx={2} fill={c("Abdomen")} />
            <Rect x={36} y={65} width={11} height={9} rx={2} fill={c("Abdomen")} />
            <Rect x={53} y={65} width={11} height={9} rx={2} fill={c("Abdomen")} />
            <Rect x={36} y={76} width={11} height={6} rx={2} fill={c("Abdomen")} />
            <Rect x={53} y={76} width={11} height={6} rx={2} fill={c("Abdomen")} />

            {/* Biceps - parte de cima do braco (interna) */}
            <Path
                d="M 16 36 Q 13 50 16 60 L 22 60 Q 25 50 22 36 Z"
                fill={c("Biceps")}
            />
            <Path
                d="M 78 36 Q 75 50 78 60 L 84 60 Q 87 50 84 36 Z"
                fill={c("Biceps")}
            />

            {/* Triceps - parte de tras do braco (sobreposicao quando ativo) */}
            {props.area === "Triceps" && (
                <>
                    <Path d="M 14 38 Q 11 50 14 62 L 18 62 Q 17 50 18 38 Z" fill={cor} />
                    <Path d="M 82 38 Q 85 50 82 62 L 86 62 Q 83 50 86 38 Z" fill={cor} />
                </>
            )}

            {/* Antebracos */}
            <Rect x={14} y={62} width={9} height={20} rx={3} fill={corBase} />
            <Rect x={77} y={62} width={9} height={20} rx={3} fill={corBase} />

            {/* Cintura/quadril */}
            <Path
                d="M 36 82 L 64 82 L 62 92 L 38 92 Z"
                fill={corBase}
            />

            {/* Quadriceps - frente das coxas */}
            <Path
                d="M 38 92 L 49 92 L 48 118 L 39 118 Z"
                fill={c("Quadriceps")}
            />
            <Path
                d="M 51 92 L 62 92 L 61 118 L 52 118 Z"
                fill={c("Quadriceps")}
            />

            {/* Posterior de Coxa - quando ativo, sobrepoe as coxas */}
            {props.area === "Posterior de Coxa" && (
                <>
                    <Path d="M 38 92 L 49 92 L 48 118 L 39 118 Z" fill={cor} opacity={0.85} />
                    <Path d="M 51 92 L 62 92 L 61 118 L 52 118 Z" fill={cor} opacity={0.85} />
                </>
            )}

            {/* Joelhos */}
            <Circle cx={43.5} cy={119} r={3} fill={corBase} />
            <Circle cx={56.5} cy={119} r={3} fill={corBase} />

            {/* Panturrilhas */}
            <Path
                d="M 39 122 L 48 122 Q 47 130 46 138 L 40 138 Q 39 130 39 122 Z"
                fill={c("Panturrilha")}
            />
            <Path
                d="M 52 122 L 61 122 Q 61 130 60 138 L 54 138 Q 53 130 52 122 Z"
                fill={c("Panturrilha")}
            />
        </Svg>
    )
}

export default BodySilhueta
