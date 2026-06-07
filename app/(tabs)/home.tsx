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
import { Ficha, Exercicio, RegistroPeso } from "../../src/types"
import { getFichas, subscribe as subFichas } from "../../src/data/fichasStore"
import {
    getExerciciosComPR,
    getRegistrosDoExercicio,
    getPRAtual,
    subscribe as subPRs,
} from "../../src/data/prsStore"
import {
    getRegistros as getPesos,
    getPesoAtual,
    getPesoInicial,
    subscribe as subPesos,
} from "../../src/data/pesoStore"
import { exercicios } from "../../src/data/exercicios"
import { labelArea } from "../../src/data/labelsArea"
import BodySilhueta from "../../src/components/BodySilhueta"
import MiniGrafico from "../../src/components/MiniGrafico"

type ExercicioComGrafico = {
    exercicio: Exercicio
    valores: number[]
    prAtual: number | null
}

export default function Home() {
    const { width } = useWindowDimensions()

    // useState - estados da home (Aula 4)
    const [fichas, setFichas] = useState<Ficha[]>(getFichas())
    const [graficos, setGraficos] = useState<ExercicioComGrafico[]>([])
    const [pesos, setPesos] = useState<RegistroPeso[]>(getPesos())

    const recarregarGraficos = () => {
        const ids = getExerciciosComPR()
        const novos: ExercicioComGrafico[] = []
        for (const id of ids) {
            const ex = exercicios.find((e) => e.id === id)
            if (!ex) continue
            const registros = getRegistrosDoExercicio(id).slice().reverse()
            novos.push({
                exercicio: ex,
                valores: registros.map((r) => r.peso),
                prAtual: getPRAtual(id),
            })
        }
        setGraficos(novos)
    }

    // useEffect com cleanup multiplo - 3 stores simultaneos (Aula 4)
    useEffect(() => {
        recarregarGraficos()
        const unsubF = subFichas(() => setFichas([...getFichas()]))
        const unsubP = subPRs(() => recarregarGraficos())
        const unsubW = subPesos(() => setPesos(getPesos()))
        return () => {
            unsubF()
            unsubP()
            unsubW()
        }
    }, [])

    // Calculos responsivos
    const cardWidth = Math.min(Math.max(width * 0.4, 130), 180)
    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    // Dados do peso para o card resumo
    const pesoAtual = getPesoAtual()
    const pesoInicial = getPesoInicial()
    const variacaoPeso =
        pesoAtual !== null && pesoInicial !== null ? pesoAtual - pesoInicial : null
    // Valores do mini-grafico em ordem cronologica
    const valoresPeso = [...pesos]
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((r) => r.peso)

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

            {/* CARD DESTACADO: MEU PESO */}
            <TouchableOpacity
                style={styles.cardPeso}
                onPress={() => router.push("/meusDados")}
            >
                <View style={styles.cardPesoEsquerda}>
                    <Ionicons name="scale-outline" size={26} color="#ffffff" />
                    <View>
                        <Text style={styles.cardPesoLabel}>Meu peso</Text>
                        <View style={styles.cardPesoLinha}>
                            <Text style={styles.cardPesoValor}>
                                {pesoAtual !== null ? pesoAtual + " kg" : "Sem registro"}
                            </Text>
                            {variacaoPeso !== null && variacaoPeso !== 0 && (
                                <View style={styles.cardPesoVariacao}>
                                    <Ionicons
                                        name={
                                            variacaoPeso > 0
                                                ? "trending-up"
                                                : "trending-down"
                                        }
                                        size={12}
                                        color={variacaoPeso > 0 ? "#ff9d4d" : "#4dff9d"}
                                    />
                                    <Text
                                        style={[
                                            styles.cardPesoVariacaoTexto,
                                            {
                                                color:
                                                    variacaoPeso > 0
                                                        ? "#ff9d4d"
                                                        : "#4dff9d",
                                            },
                                        ]}
                                    >
                                        {variacaoPeso > 0 ? "+" : ""}
                                        {variacaoPeso.toFixed(1)} kg
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                {valoresPeso.length > 0 && (
                    <MiniGrafico valores={valoresPeso} largura={100} altura={40} />
                )}
                <Ionicons name="chevron-forward" size={18} color="#aaaaaa" />
            </TouchableOpacity>

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

            {/* SECAO: SEUS GRAFICOS DE PR */}
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
                    onPress={() => router.push("/meusDados")}
                >
                    <Ionicons name="scale-outline" size={26} color="#ffffff" />
                    <Text style={styles.botaoAcaoTexto}>Pesar-se</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoAcao}
                    onPress={() => router.push("/grafico")}
                >
                    <Ionicons name="stats-chart-outline" size={26} color="#ffffff" />
                    <Text style={styles.botaoAcaoTexto}>Gráficos</Text>
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
    cardPeso: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cardPesoEsquerda: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cardPesoLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
    },
    cardPesoLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
    cardPesoValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 18,
    },
    cardPesoVariacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        backgroundColor: "#2a2a35",
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    cardPesoVariacaoTexto: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 11,
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
    cardGraficoHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
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
    acoesRapidas: { flexDirection: "row", gap: 8 },
    botaoAcao: {
        flex: 1,
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        gap: 6,
    },
    botaoAcaoTexto: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 11,
        textAlign: "center",
    },
})
