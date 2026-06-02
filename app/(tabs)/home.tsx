import { useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Ficha, Exercicio } from "../../src/types"
import { getFichas, subscribe as subFichas } from "../../src/data/fichasStore"
import {
    getExerciciosComPR,
    getRegistrosDoExercicio,
    getPRAtual,
    subscribe as subPRs,
} from "../../src/data/prsStore"
import { exercicios } from "../../src/data/exercicios"
import { labelArea } from "../../src/data/labelsArea"
import BodySilhueta from "../../src/components/BodySilhueta"
import MiniGrafico from "../../src/components/MiniGrafico"

// Tipo derivado: cada exercicio com PR + dados para o mini grafico
type ExercicioComGrafico = {
    exercicio: Exercicio
    valores: number[]
    prAtual: number | null
}

export default function Home() {
    const { width } = useWindowDimensions()

    // useState - lista de fichas e lista de exercicios com PR (Aula 4)
    const [fichas, setFichas] = useState<Ficha[]>(getFichas())
    const [graficos, setGraficos] = useState<ExercicioComGrafico[]>([])

    // Recalcula os dados dos graficos a partir do store
    const recarregarGraficos = () => {
        const ids = getExerciciosComPR()
        const novos: ExercicioComGrafico[] = []
        for (const id of ids) {
            const ex = exercicios.find((e) => e.id === id)
            if (!ex) continue
            // Registros em ordem cronologica (antigo -> recente) para o grafico
            const registros = getRegistrosDoExercicio(id).slice().reverse()
            novos.push({
                exercicio: ex,
                valores: registros.map((r) => r.peso),
                prAtual: getPRAtual(id),
            })
        }
        setGraficos(novos)
    }

    // useEffect - escuta mudancas nas fichas e nos PRs (Aula 4)
    useEffect(() => {
        recarregarGraficos()
        const unsubF = subFichas(() => setFichas([...getFichas()]))
        const unsubP = subPRs(() => recarregarGraficos())
        return () => {
            unsubF()
            unsubP()
        }
    }, [])

    // Calculos responsivos
    const cardWidth = Math.min(Math.max(width * 0.4, 130), 180)
    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingH }]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.saudacao}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitulo}>
                Você tem {fichas.length} ficha(s) cadastrada(s)
            </Text>

            {/* SECAO: SUAS FICHAS */}
            <View style={styles.linhaSection}>
                <Text style={styles.section}>Suas fichas</Text>
                <TouchableOpacity onPress={() => router.push("/fichas")}>
                    <Text style={styles.verTodas}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={fichas}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listaCards}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.cardFicha, { width: cardWidth }]}
                        onPress={() =>
                            router.push({
                                pathname: "/criarFicha",
                                params: { idFicha: item.id },
                            })
                        }
                    >
                        <Ionicons name="clipboard" size={24} color="#ffffff" />
                        <Text style={styles.cardNome} numberOfLines={2}>
                            {item.nome}
                        </Text>
                        <Text style={styles.cardQtd}>{item.exercicios.length} ex.</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={[styles.cardVazio, { width: cardWidth * 1.4 }]}>
                        <Text style={styles.cardVazioTexto}>Sem fichas ainda</Text>
                        <TouchableOpacity
                            style={styles.botaoCriar}
                            onPress={() => router.push("/criarFicha")}
                        >
                            <Text style={styles.botaoCriarTexto}>+ Criar</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* SECAO: SEUS GRAFICOS (ao lado das fichas) */}
            <View style={styles.linhaSection}>
                <Text style={styles.section}>Seus gráficos</Text>
                <TouchableOpacity onPress={() => router.push("/grafico")}>
                    <Text style={styles.verTodas}>Ver todos</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={graficos}
                keyExtractor={(item) => item.exercicio.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listaCards}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.cardGrafico, { width: cardWidth * 1.15 }]}
                        onPress={() =>
                            router.push({
                                pathname: "/grafico",
                                params: { exercicioId: item.exercicio.id },
                            })
                        }
                    >
                        <View style={styles.cardGraficoHeader}>
                            <BodySilhueta area={item.exercicio.area} size={24} />
                            <View style={styles.cardGraficoInfo}>
                                <Text style={styles.cardNome} numberOfLines={1}>
                                    {item.exercicio.nome}
                                </Text>
                                <Text style={styles.cardQtd}>
                                    {labelArea(item.exercicio.area)}
                                </Text>
                            </View>
                        </View>

                        <MiniGrafico
                            valores={item.valores}
                            largura={cardWidth * 1.15 - 28}
                            altura={40}
                        />

                        <View style={styles.cardGraficoRodape}>
                            <Text style={styles.cardGraficoPR}>
                                {item.prAtual !== null ? item.prAtual + " kg" : "—"}
                            </Text>
                            <Text style={styles.cardGraficoLabel}>PR</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={[styles.cardVazio, { width: cardWidth * 1.4 }]}>
                        <Ionicons name="stats-chart-outline" size={22} color="#aaaaaa" />
                        <Text style={styles.cardVazioTexto}>Sem PRs registrados</Text>
                        <TouchableOpacity
                            style={styles.botaoCriar}
                            onPress={() => router.push("/exercicios")}
                        >
                            <Text style={styles.botaoCriarTexto}>Registrar</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* SECAO: ACOES RAPIDAS */}
            <View style={styles.linhaSection}>
                <Text style={styles.section}>Ações rápidas</Text>
            </View>

            <View style={styles.acoesRapidas}>
                <TouchableOpacity
                    style={styles.botaoAcao}
                    onPress={() => router.push("/criarFicha")}
                >
                    <Ionicons name="add-circle-outline" size={26} color="#ffffff" />
                    <Text style={styles.botaoAcaoTexto}>Nova ficha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoAcao}
                    onPress={() => router.push("/grafico")}
                >
                    <Ionicons name="stats-chart-outline" size={26} color="#ffffff" />
                    <Text style={styles.botaoAcaoTexto}>Ver gráficos</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f0f14" },
    scrollContent: { paddingTop: 16, paddingBottom: 24 },
    saudacao: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 22 },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
        marginTop: 2,
    },
    linhaSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
    },
    section: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 16 },
    verTodas: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 13 },
    listaCards: { gap: 12, paddingVertical: 4, paddingRight: 4 },
    cardFicha: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        height: 130,
        justifyContent: "space-between",
    },
    cardGrafico: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        height: 130,
        justifyContent: "space-between",
    },
    cardGraficoHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    cardGraficoInfo: { flex: 1 },
    cardGraficoRodape: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 4,
    },
    cardGraficoPR: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
    },
    cardGraficoLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 11,
    },
    cardNome: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 13,
    },
    cardQtd: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 11 },
    cardVazio: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        height: 130,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    cardVazioTexto: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
    },
    botaoCriar: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    botaoCriarTexto: {
        fontFamily: "Inter_600SemiBold",
        color: "#000000",
        fontSize: 13,
    },
    acoesRapidas: { flexDirection: "row", gap: 12 },
    botaoAcao: {
        flex: 1,
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        gap: 6,
    },
    botaoAcaoTexto: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 13,
    },
})
