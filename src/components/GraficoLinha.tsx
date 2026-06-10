import { View, Text, StyleSheet } from "react-native"
import Svg, { Line, Circle, Path, Text as SvgText } from "react-native-svg"
import { useTheme } from "../theme/ThemeContext"

type Ponto = { valor: number; label: string }

type GraficoLinhaProps = {
    pontos: Ponto[]
    largura?: number
    altura?: number
    cor?: string
}

const GraficoLinha = (props: GraficoLinhaProps) => {
    const { colors } = useTheme()
    const largura = props.largura ?? 320
    const altura = props.altura ?? 200
    const cor = props.cor ?? colors.text

    const padL = 36, padR = 12, padT = 16, padB = 28
    const w = largura - padL - padR
    const h = altura - padT - padB

    if (props.pontos.length === 0) {
        return (
            <View
                style={[
                    styles.vazioBox,
                    {
                        width: largura,
                        height: altura,
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                    },
                ]}
            >
                <Text style={[styles.vazioTexto, { color: colors.textMuted }]}>
                    Sem registros ainda para gerar o gráfico.
                </Text>
            </View>
        )
    }

    const valores = props.pontos.map((p) => p.valor)
    const min = Math.min(...valores)
    const max = Math.max(...valores)
    const range = max - min === 0 ? 1 : max - min
    const valorMin = min - range * 0.1
    const valorMax = max + range * 0.1
    const rangeReal = valorMax - valorMin

    const coords = props.pontos.map((p, i) => {
        const x = padL + (i / Math.max(props.pontos.length - 1, 1)) * w
        const y = padT + h - ((p.valor - valorMin) / rangeReal) * h
        return { x, y, ...p }
    })

    const pathD = coords
        .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
        .join(" ")

    const niveis = [valorMin, (valorMin + valorMax) / 2, valorMax]

    return (
        <View>
            <Svg width={largura} height={altura}>
                {niveis.map((n, idx) => {
                    const y = padT + h - ((n - valorMin) / rangeReal) * h
                    return (
                        <Line
                            key={`grid-${idx}`}
                            x1={padL}
                            y1={y}
                            x2={padL + w}
                            y2={y}
                            stroke={colors.border}
                            strokeWidth={1}
                        />
                    )
                })}

                {niveis.map((n, idx) => {
                    const y = padT + h - ((n - valorMin) / rangeReal) * h
                    return (
                        <SvgText
                            key={`ly-${idx}`}
                            x={padL - 6}
                            y={y + 4}
                            fill={colors.textMuted}
                            fontSize={10}
                            textAnchor="end"
                            fontFamily="Inter_400Regular"
                        >
                            {Math.round(n)}
                        </SvgText>
                    )
                })}

                <Path d={pathD} stroke={cor} strokeWidth={2} fill="none" />

                {coords.map((c, idx) => (
                    <Circle
                        key={`pt-${idx}`}
                        cx={c.x}
                        cy={c.y}
                        r={4}
                        fill={cor}
                        stroke={colors.background}
                        strokeWidth={2}
                    />
                ))}

                {coords.length <= 8 &&
                    coords.map((c, idx) => (
                        <SvgText
                            key={`lx-${idx}`}
                            x={c.x}
                            y={altura - 8}
                            fill={colors.textMuted}
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
        borderRadius: 12,
        borderWidth: 1.5,
    },
    vazioTexto: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        paddingHorizontal: 16,
    },
})
