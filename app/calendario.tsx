import { useEffect, useState, useMemo } from "react"
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    useWindowDimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { SessaoTreino } from "../src/types"
import {
    getSessoesMes,
    getSessoes,
    removeSessao,
    subscribe,
} from "../src/data/sessaoStore"
import { calcularStreak, calcularQtdSemana } from "../src/data/streakCalc"
import { useTheme } from "../src/theme/ThemeContext"

const NOMES_MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]
const NOMES_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const dataOnly = (iso: string): string => iso.substring(0, 10)

export default function Calendario() {
    const { width } = useWindowDimensions()
    const { colors } = useTheme()

    const hoje = new Date()
    const [mesAno, setMesAno] = useState<{ ano: number; mes: number }>({
        ano: hoje.getFullYear(),
        mes: hoje.getMonth() + 1,
    })
    const [versao, setVersao] = useState<number>(0)

    useEffect(() => {
        const unsub = subscribe(() => setVersao((v) => v + 1))
        return unsub
    }, [])

    const sessoesMes = useMemo(
        () => getSessoesMes(mesAno.ano, mesAno.mes),
        [mesAno, versao]
    )

    const diasTreinados = new Set<number>()
    for (const s of sessoesMes) {
        diasTreinados.add(new Date(s.data).getDate())
    }

    const todasSessoes = getSessoes()
    const streak = calcularStreak(todasSessoes)
    const qtdSemana = calcularQtdSemana(todasSessoes)

    const primeiroDia = new Date(mesAno.ano, mesAno.mes - 1, 1)
    const ultimoDia = new Date(mesAno.ano, mesAno.mes, 0).getDate()
    const diaSemanaInicio = primeiroDia.getDay()

    const celulas: (number | null)[] = []
    for (let i = 0; i < diaSemanaInicio; i++) celulas.push(null)
    for (let d = 1; d <= ultimoDia; d++) celulas.push(d)

    const padding = 16
    const gap = 6
    const larguraDisponivel = Math.min(width, 500) - padding * 2
    const tamanhoCelula = (larguraDisponivel - gap * 6) / 7

    const navegarMes = (delta: number) => {
        let novoMes = mesAno.mes + delta
        let novoAno = mesAno.ano
        if (novoMes < 1) { novoMes = 12; novoAno-- }
        else if (novoMes > 12) { novoMes = 1; novoAno++ }
        setMesAno({ ano: novoAno, mes: novoMes })
    }

    const hojeStr = dataOnly(new Date().toISOString())
    const ehHoje = (dia: number): boolean => {
        const ds = `${mesAno.ano}-${String(mesAno.mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
        return ds === hojeStr
    }

    const formatarHora = (iso: string): string => {
        const d = new Date(iso)
        return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0")
    }

    const cardStyle = { backgroundColor: colors.surface, borderColor: colors.border }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["bottom"]}>
            <FlatList
                data={sessoesMes}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View>
                        <View style={styles.statsRow}>
                            <View style={[styles.statBox, cardStyle]}>
                                <Ionicons name="flame" size={20} color={colors.fire} />
                                <Text style={[styles.statValor, { color: colors.text }]}>{streak}</Text>
                                <Text style={[styles.statLabel, { color: colors.textMuted }]}>dias seguidos</Text>
                            </View>
                            <View style={[styles.statBox, cardStyle]}>
                                <Ionicons name="calendar" size={20} color={colors.success} />
                                <Text style={[styles.statValor, { color: colors.text }]}>{qtdSemana}</Text>
                                <Text style={[styles.statLabel, { color: colors.textMuted }]}>esta semana</Text>
                            </View>
                            <View style={[styles.statBox, cardStyle]}>
                                <Ionicons name="trophy" size={20} color={colors.warning} />
                                <Text style={[styles.statValor, { color: colors.text }]}>{sessoesMes.length}</Text>
                                <Text style={[styles.statLabel, { color: colors.textMuted }]}>este mês</Text>
                            </View>
                        </View>

                        <View style={styles.mesHeader}>
                            <TouchableOpacity onPress={() => navegarMes(-1)} style={[styles.botaoMes, cardStyle]}>
                                <Ionicons name="chevron-back" size={22} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.mesNome, { color: colors.text }]}>
                                {NOMES_MESES[mesAno.mes - 1]} {mesAno.ano}
                            </Text>
                            <TouchableOpacity onPress={() => navegarMes(1)} style={[styles.botaoMes, cardStyle]}>
                                <Ionicons name="chevron-forward" size={22} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.linhaDias, { gap }]}>
                            {NOMES_DIAS.map((nome) => (
                                <View key={nome} style={[styles.cabecalhoDia, { width: tamanhoCelula }]}>
                                    <Text style={[styles.cabecalhoDiaTexto, { color: colors.textDim }]}>
                                        {nome}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={[styles.grid, { gap }]}>
                            {celulas.map((dia, idx) => {
                                if (dia === null) {
                                    return <View key={`v-${idx}`} style={{ width: tamanhoCelula, height: tamanhoCelula }} />
                                }
                                const treinou = diasTreinados.has(dia)
                                const isHoje = ehHoje(dia)
                                return (
                                    <View
                                        key={`d-${dia}`}
                                        style={[
                                            styles.celula,
                                            {
                                                width: tamanhoCelula,
                                                height: tamanhoCelula,
                                                backgroundColor: treinou ? colors.success : colors.surface,
                                                borderColor: isHoje ? colors.text : "transparent",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color: treinou ? colors.textInverse : colors.text,
                                                fontFamily: treinou ? "Inter_600SemiBold" : "Inter_400Regular",
                                                fontSize: 13,
                                            }}
                                        >
                                            {dia}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>

                        <Text style={[styles.section, { color: colors.text }]}>
                            Sessões de {NOMES_MESES[mesAno.mes - 1]}
                        </Text>
                    </View>
                }
                renderItem={({ item }: { item: SessaoTreino }) => (
                    <View style={[styles.cardSessao, cardStyle]}>
                        <View style={[styles.cardSessaoIcone, { backgroundColor: colors.surfaceAlt }]}>
                            <Ionicons name="barbell-outline" size={20} color={colors.text} />
                        </View>
                        <View style={styles.cardSessaoInfo}>
                            <Text style={[styles.cardSessaoNome, { color: colors.text }]}>
                                {item.nomeFicha}
                            </Text>
                            <Text style={[styles.cardSessaoData, { color: colors.textMuted }]}>
                                Dia {new Date(item.data).getDate()} • {formatarHora(item.data)} • {item.duracaoMin} min
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeSessao(item.id)}
                            style={styles.botaoRemover}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="trash-outline" size={18} color={colors.danger} />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.vazioBox}>
                        <Ionicons name="bed-outline" size={32} color={colors.textDim} />
                        <Text style={[styles.vazio, { color: colors.textMuted }]}>
                            Sem treinos registrados este mês.
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 24 },
    statsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
    statBox: { flex: 1, borderWidth: 1.5, borderRadius: 12, padding: 12, alignItems: "center", gap: 4 },
    statValor: { fontFamily: "Inter_600SemiBold", fontSize: 22 },
    statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "center" },
    mesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    botaoMes: { padding: 8, borderRadius: 8, borderWidth: 1.5 },
    mesNome: { fontFamily: "Inter_600SemiBold", fontSize: 18, textTransform: "capitalize" },
    linhaDias: { flexDirection: "row", marginBottom: 6 },
    cabecalhoDia: { alignItems: "center", justifyContent: "center" },
    cabecalhoDiaTexto: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
    grid: { flexDirection: "row", flexWrap: "wrap" },
    celula: { borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
    section: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginTop: 24, marginBottom: 8 },
    cardSessao: { borderWidth: 1.5, borderRadius: 12, padding: 12, marginVertical: 4, flexDirection: "row", alignItems: "center", gap: 12 },
    cardSessaoIcone: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    cardSessaoInfo: { flex: 1 },
    cardSessaoNome: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    cardSessaoData: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    botaoRemover: { padding: 6 },
    vazioBox: { alignItems: "center", paddingVertical: 24, gap: 8 },
    vazio: { fontFamily: "Inter_400Regular", fontSize: 13 },
})
