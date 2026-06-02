import { View, StyleSheet } from "react-native"
import Svg, { Path, Circle, Line } from "react-native-svg"

type MiniGraficoProps = {
    valores: number[]
    largura?: number
    altura?: number
    cor?: string
}

const MiniGrafico = (props: MiniGraficoProps) => {
    const largura = props.largura ?? 120
    const altura = props.altura ?? 40
    const cor = props.cor ?? "#ffffff"
    const padding = 4

    if (props.valores.length === 0) {
        return <View style={[{ width: largura, height: altura }, styles.vazio]} />
    }

    if (props.valores.length === 1) {
        // So um ponto - mostra uma linha horizontal centralizada
        const y = altura / 2
        return (
            <Svg width={largura} height={altura}>
                <Line
                    x1={padding}
                    y1={y}
                    x2={largura - padding}
                    y2={y}
                    stroke={cor}
                    strokeWidth={2}
                    strokeDasharray="3,3"
                    opacity={0.5}
                />
                <Circle cx={largura / 2} cy={y} r={3} fill={cor} />
            </Svg>
        )
    }

    // Calcula range para escala vertical
    const min = Math.min(...props.valores)
    const max = Math.max(...props.valores)
    const range = max - min === 0 ? 1 : max - min

    const w = largura - padding * 2
    const h = altura - padding * 2

    // Coordenadas de cada ponto
    const coords = props.valores.map((v, i) => {
        const x = padding + (i / (props.valores.length - 1)) * w
        const y = padding + h - ((v - min) / range) * h
        return { x, y }
    })

    // Path conectando todos os pontos
    const pathD = coords
        .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
        .join(" ")

    return (
        <Svg width={largura} height={altura}>
            <Path d={pathD} stroke={cor} strokeWidth={2} fill="none" />
            {/* Bolinhas so no primeiro e ultimo ponto */}
            <Circle cx={coords[0].x} cy={coords[0].y} r={2.5} fill={cor} opacity={0.6} />
            <Circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r={3}
                fill={cor}
            />
        </Svg>
    )
}

export default MiniGrafico

const styles = StyleSheet.create({
    vazio: {
        backgroundColor: "transparent",
    },
})
