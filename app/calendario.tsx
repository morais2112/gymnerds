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

const NOMES_MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const NOMES_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// Helpers de data
const dataOnly = (iso: string): string => iso.substring(0, 10)

export default function Calendario() {
    const { width } = useWindowDimensions()

    // useState: mes/ano sendo visualizado (Aula 4)
    const hoje = new Date()
    const [mesAno, setMesAno] = useState<{ ano: number; mes: number }>({
        ano: hoje.getFullYear(),
        mes: hoje.getMonth() + 1,
    })
    const [versao, setVersao] = useState<number>(0)

    // useEffect com cleanup - escuta mudancas no store (Aula 4)
    useEffect(() => {
        const unsub = subscribe(() => setVersao((v) => v + 1))
        return unsub
    }, [])

    // Sessoes do mes atual
    const sessoesMes = useMemo(
        () => getSessoesMes(mesAno.ano, mesAno.mes),
        [mesAno, versao]
    )

    // Set de dias treinados no mes
    const diasTreinados = new Set<number>()
    for (const s of sessoesMes) {
        const d = new Date(s.data)
        diasTreinados.add(d.getDate())
    }

    // Stats globais
    const todasSessoes = getSessoes()
    const streak = calcularStreak(todasSessoes)
    const qtdSemana = calcularQtdSemana(todasSessoes)

    // Construir grid do calendario
    const primeiroDia = new Date(mesAno.ano, mesAno.mes - 1, 1)
    const ultimoDia = new Date(mesAno.ano, mesAno.mes, 0).getDate()
    const diaSemanaInicio = primeiroDia.getDay() // 0=domingo

    // Monta um array de celulas: null para os dias vazios antes do dia 1
    const celulas: (number | null)[] = []
    for (let i = 0; i < diaSemanaInicio; i++) celulas.push(null)
    for (let d = 1; d <= ultimoDia; d++) celulas.push(d)

    // Calculo do tamanho das celulas
    const padding = 16
    const gap = 6
    const larguraDisponivel = Math.min(width, 500) - padding * 2
    const tamanhoCelula = (larguraDisponivel - gap * 6) / 7

    const navegarMes = (delta: number) => {
        let novoMes = mesAno.mes + delta
        let novoAno = mesAno.ano
        if (novoMes < 1) {
            novoMes = 12
            novoAno--
        } else if (novoMes > 12) {
            novoMes = 1
            novoAno++
        }
        setMesAno({ ano: novoAno, mes: novoMes })
    }

    const hojeStr = dataOnly(new Date().toISOString())
    const ehHoje = (dia: number): boolean => {
        const ds = `${mesAno.ano}-${String(mesAno.mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
        return ds === hojeStr
    }

    const formatarHora = (iso: string): string => {
        const d = new Date(iso)
        const h = String(d.getHours()).padStart(2, "0")
        const m = String(d.getMinutes()).padStart(2, "0")
        return h + ":" + m
    }

    return (
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
            <FlatList
                data={sessoesMes}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View>
                        {/* Cards de stats */}
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Ionicons name="flame" size={20} color="#ff6d4d" />
                                <Text style={styles.statValor}>{streak}</Text>
                                <Text style={styles.statLabel}>dias seguidos</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Ionicons name="calendar" size={20} color="#4dff9d" />
                                <Text style={styles.statValor}>{qtdSemana}</Text>
                                <Text style={styles.statLabel}>esta semana</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Ionicons name="trophy" size={20} color="#ffd44d" />
                                <Text style={styles.statValor}>{sessoesMes.length}</Text>
                                <Text style={styles.statLabel}>este mês</Text>
                            </View>
                        </View>

                        {/* Navegacao do mes */}
                        <View style={styles.mesHeader}>
                            <TouchableOpacity
                                onPress={() => navegarMes(-1)}
                                style={styles.botaoMes}
                            >
                                <Ionicons name="chevron-back" size={22} color="#ffffff" />
                            </TouchableOpacity>
                            <Text style={styles.mesNome}>
                                {NOMES_MESES[mesAno.mes - 1]} {mesAno.ano}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navegarMes(1)}
                                style={styles.botaoMes}
                            >
                                <Ionicons name="chevron-forward" size={22} color="#ffffff" />
                            </TouchableOpacity>
                        </View>

                        {/* Nomes dos dias da semana */}
                        <View style={[styles.linhaDias, { gap }]}>
                            {NOMES_DIAS.map((nome) => (
                                <View
                                    key={nome}
                                    style={[styles.cabecalhoDia, { width: tamanhoCelula }]}
                                >
                                    <Text style={styles.cabecalhoDiaTexto}>{nome}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Grid de celulas */}
                        <View style={[styles.grid, { gap }]}>
                            {celulas.map((dia, idx) => {
                                if (dia === null) {
                                    return (
                                        <View
                                            key={`vazio-${idx}`}
                                            style={[styles.celulaVazia, { width: tamanhoCelula, height: tamanhoCelula }]}
                                        />
                                    )
                                }
                                const treinou = diasTreinados.has(dia)
                                const hoje = ehHoje(dia)
                                return (
                                    <View
                                        key={`dia-${dia}`}
                                        style={[
                                            styles.celula,
                                            { width: tamanhoCelula, height: tamanhoCelula },
                                            treinou && styles.celulaTreinou,
                                            hoje && styles.celulaHoje,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.celulaTexto,
                                                treinou && styles.celulaTextoTreinou,
                                            ]}
                                        >
                                            {dia}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>

                        {/* Lista de sessoes do mes */}
                        <Text style={styles.section}>
                            Sessões de {NOMES_MESES[mesAno.mes - 1]}
                        </Text>
                    </View>
                }
                renderItem={({ item }: { item: SessaoTreino }) => (
                    <View style={styles.cardSessao}>
                        <View style={styles.cardSessaoIcone}>
                            <Ionicons name="barbell-outline" size={20} color="#ffffff" />
                        </View>
                        <View style={styles.cardSessaoInfo}>
                            <Text style={styles.cardSessaoNome}>{item.nomeFicha}</Text>
                            <Text style={styles.cardSessaoData}>
                                Dia {new Date(item.data).getDate()} •{" "}
                                {formatarHora(item.data)} • {item.duracaoMin} min
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeSessao(item.id)}
                            style={styles.botaoRemover}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.vazioBox}>
                        <Ionicons name="bed-outline" size={32} color="#666" />
                        <Text style={styles.vazio}>
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
    safe: { flex: 1, backgroundColor: "#0f0f14" },
    scrollContent: { padding: 16, paddingBottom: 24 },
    statsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
    statBox: {
        flex: 1,
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        gap: 4,
    },
    statValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 22,
    },
    statLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 11,
        textAlign: "center",
    },
    mesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    botaoMes: {
        padding: 8,
        backgroundColor: "#1c1c24",
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
    },
    mesNome: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 18,
        textTransform: "capitalize",
    },
    linhaDias: {
        flexDirection: "row",
        marginBottom: 6,
    },
    cabecalhoDia: {
        alignItems: "center",
        justifyContent: "center",
    },
    cabecalhoDiaTexto: {
        fontFamily: "Inter_600SemiBold",
        color: "#666",
        fontSize: 11,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    celulaVazia: {
        backgroundColor: "transparent",
    },
    celula: {
        backgroundColor: "#1c1c24",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    celulaTreinou: {
        backgroundColor: "#4dff9d",
    },
    celulaHoje: {
        borderColor: "#ffffff",
    },
    celulaTexto: {
        fontFamily: "Inter_400Regular",
        color: "#ffffff",
        fontSize: 13,
    },
    celulaTextoTreinou: {
        color: "#0f0f14",
        fontFamily: "Inter_600SemiBold",
    },
    section: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
        marginTop: 24,
        marginBottom: 8,
    },
    cardSessao: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cardSessaoIcone: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#2a2a35",
        alignItems: "center",
        justifyContent: "center",
    },
    cardSessaoInfo: { flex: 1 },
    cardSessaoNome: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 15,
    },
    cardSessaoData: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 2,
    },
    botaoRemover: { padding: 6 },
    vazioBox: {
        alignItems: "center",
        paddingVertical: 24,
        gap: 8,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
    },
})
