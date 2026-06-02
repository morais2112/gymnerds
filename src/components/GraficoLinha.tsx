import { View, Text, StyleSheet } from "react-native"
import Svg, { Line, Circle, Path, Text as SvgText } from "react-native-svg"

// Props tipadas - cada ponto tem peso e label da data
type Ponto = {
    valor: number
    label: string  // ex: "08/06"
}

type GraficoLinhaProps = {
    pontos: Ponto[]   // ja em ordem cronologica (antigo -> recente)
    largura?: number
    altura?: number
    cor?: string
}

const GraficoLinha = (props: GraficoLinhaProps) => {
    const largura = props.largura ?? 320
    const altura = props.altura ?? 200
    const cor = props.cor ?? "#ffffff"

    // Padding interno do grafico (espaco pros labels)
    const padL = 36, padR = 12, padT = 16, padB = 28
    const w = largura - padL - padR
    const h = altura - padT - padB

    if (props.pontos.length === 0) {
        return (
            <View style={[styles.vazioBox, { width: largura, height: altura }]}>
                <Text style={styles.vazioTexto}>
                    Sem registros ainda para gerar o gráfico.
                </Text>
            </View>
        )
    }

    // Calcula min e max dos valores para escala vertical
    const valores = props.pontos.map((p) => p.valor)
    const min = Math.min(...valores)
    const max = Math.max(...valores)
    // se min == max, adiciona um range para o ponto nao ficar grudado
    const range = max - min === 0 ? 1 : max - min
    const valorMin = min - range * 0.1
    const valorMax = max + range * 0.1
    const rangeReal = valorMax - valorMin

    // Mapeia cada ponto para coordenadas do SVG
    const coords = props.pontos.map((p, i) => {
        const x = padL + (i / Math.max(props.pontos.length - 1, 1)) * w
        const y = padT + h - ((p.valor - valorMin) / rangeReal) * h
        return { x, y, ...p }
    })

    // Gera o path da linha conectando todos os pontos
    const pathD = coords
        .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
        .join(" ")

    // Linhas horizontais de grade (3 niveis: min, meio, max)
    const niveis = [valorMin, (valorMin + valorMax) / 2, valorMax]

    return (
        <View>
            <Svg width={largura} height={altura}>
                {/* Grade horizontal + labels do eixo Y */}
                {niveis.map((n, idx) => {
                    const y = padT + h - ((n - valorMin) / rangeReal) * h
                    return (
                        <Line
                            key={`grid-${idx}`}
                            x1={padL}
                            y1={y}
                            x2={padL + w}
                            y2={y}
                            stroke="#2a2a35"
                            strokeWidth={1}
                        />
                    )
                })}

                {/* Labels do eixo Y (valores) */}
                {niveis.map((n, idx) => {
                    const y = padT + h - ((n - valorMin) / rangeReal) * h
                    return (
                        <SvgText
                            key={`label-y-${idx}`}
                            x={padL - 6}
                            y={y + 4}
                            fill="#aaaaaa"
                            fontSize={10}
                            textAnchor="end"
                            fontFamily="Inter_400Regular"
                        >
                            {Math.round(n)}
                        </SvgText>
                    )
                })}

                {/* Linha conectando os pontos */}
                <Path d={pathD} stroke={cor} strokeWidth={2} fill="none" />

                {/* Pontos (bolinhas) */}
                {coords.map((c, idx) => (
                    <Circle
                        key={`pt-${idx}`}
                        cx={c.x}
                        cy={c.y}
                        r={4}
                        fill={cor}
                        stroke="#0f0f14"
                        strokeWidth={2}
                    />
                ))}

                {/* Labels do eixo X (datas) - mostra so se tiver poucos pontos */}
                {coords.length <= 8 &&
                    coords.map((c, idx) => (
                        <SvgText
                            key={`label-x-${idx}`}
                            x={c.x}
                            y={altura - 8}
                            fill="#aaaaaa"
                            fontSize={9}
                            textAnchor="middle"
                            fontFamily="Inter_400Regular"
                        >
                            {c.label}
                        </SvgText>
                    ))}
            </Svg>
        </View>
    )
}

export default GraficoLinha

const styles = StyleSheet.create({
    vazioBox: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
    },
    vazioTexto: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        textAlign: "center",
        paddingHorizontal: 16,
    },
})
