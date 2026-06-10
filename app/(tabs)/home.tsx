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
import { Ficha, Exercicio, RegistroPeso, SessaoTreino } from "../../src/types"
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
import {
    getSessoes,
    subscribe as subSessoes,
} from "../../src/data/sessaoStore"
import { calcularStreak, calcularQtdSemana } from "../../src/data/streakCalc"
import { exercicios } from "../../src/data/exercicios"
import { labelArea } from "../../src/data/labelsArea"
import BodySilhueta from "../../src/components/BodySilhueta"
import MiniGrafico from "../../src/components/MiniGrafico"
import ModalRegistrarTreino from "../../src/components/ModalRegistrarTreino"
import { useTheme } from "../../src/theme/ThemeContext"

type ExercicioComGrafico = {
    exercicio: Exercicio
    valores: number[]
    prAtual: number | null
}

export default function Home() {
    const { width } = useWindowDimensions()
    const { colors } = useTheme()

    const [fichas, setFichas] = useState<Ficha[]>(getFichas())
    const [graficos, setGraficos] = useState<ExercicioComGrafico[]>([])
    const [pesos, setPesos] = useState<RegistroPeso[]>(getPesos())
    const [sessoes, setSessoes] = useState<SessaoTreino[]>(getSessoes())
    const [modalAberto, setModalAberto] = useState<boolean>(false)

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

    useEffect(() => {
        recarregarGraficos()
        const unsubF = subFichas(() => setFichas([...getFichas()]))
        const unsubP = subPRs(() => recarregarGraficos())
        const unsubW = subPesos(() => setPesos(getPesos()))
        const unsubS = subSessoes(() => setSessoes(getSessoes()))
        return () => {
            unsubF()
            unsubP()
            unsubW()
            unsubS()
        }
    }, [])

    const cardWidth = Math.min(Math.max(width * 0.4, 130), 180)
    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    const pesoAtual = getPesoAtual()
    const pesoInicial = getPesoInicial()
    const variacaoPeso =
        pesoAtual !== null && pesoInicial !== null ? pesoAtual - pesoInicial : null
    const valoresPeso = [...pesos]
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((r) => r.peso)

    const streak = calcularStreak(sessoes)
    const qtdSemana = calcularQtdSemana(sessoes)

    // Estilos derivados do tema
    const cardStyle = { backgroundColor: colors.surface, borderColor: colors.border }
    const iconeBoxStyle = { backgroundColor: colors.surfaceAlt }

    return (
        <>
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.background }}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingHorizontal: paddingH },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.saudacao, { color: colors.text }]}>
                    Bem-vindo de volta!
                </Text>
                <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                    Você tem {fichas.length} ficha(s) cadastrada(s)
                </Text>

                {/* CARD STREAK */}
                <TouchableOpacity
                    style={[styles.cardStreak, cardStyle]}
                    onPress={() => router.push("/calendario")}
                >
                    <View style={[styles.streakIcone, iconeBoxStyle]}>
                        <Ionicons name="flame" size={28} color={colors.fire} />
                    </View>
                    <View style={styles.streakInfo}>
                        <View style={styles.streakLinha}>
                            <Text
                                style={[styles.streakValor, { color: colors.text }]}
                            >
                                {streak}
                            </Text>
                            <Text
                                style={[styles.streakLabel, { color: colors.textMuted }]}
                            >
                                {streak === 1 ? "dia seguido" : "dias seguidos"}
                            </Text>
                        </View>
                        <Text style={[styles.streakSub, { color: colors.textMuted }]}>
                            {qtdSemana} treino(s) esta semana
                        </Text>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textMuted}
                    />
                </TouchableOpacity>

                {/* Botao: TREINEI HOJE */}
                <TouchableOpacity
                    style={[
                        styles.botaoRegistrarTreino,
                        { backgroundColor: colors.success },
                    ]}
                    onPress={() => setModalAberto(true)}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={22}
                        color={colors.textInverse}
                    />
                    <Text
                        style={[
                            styles.botaoRegistrarTreinoTexto,
                            { color: colors.textInverse },
                        ]}
                    >
                        Treinei hoje!
                    </Text>
                </TouchableOpacity>

                {/* CARD MEU PESO */}
                <TouchableOpacity
                    style={[styles.cardPeso, cardStyle]}
                    onPress={() => router.push("/meusDados")}
                >
                    <View style={styles.cardPesoEsquerda}>
                        <Ionicons
                            name="scale-outline"
                            size={26}
                            color={colors.text}
                        />
                        <View>
                            <Text
                                style={[
                                    styles.cardPesoLabel,
                                    { color: colors.textMuted },
                                ]}
                            >
                                Meu peso
                            </Text>
                            <View style={styles.cardPesoLinha}>
                                <Text
                                    style={[
                                        styles.cardPesoValor,
                                        { color: colors.text },
                                    ]}
                                >
                                    {pesoAtual !== null
                                        ? pesoAtual + " kg"
                                        : "Sem registro"}
                                </Text>
                                {variacaoPeso !== null && variacaoPeso !== 0 && (
                                    <View
                                        style={[
                                            styles.cardPesoVariacao,
                                            { backgroundColor: colors.surfaceAlt },
                                        ]}
                                    >
                                        <Ionicons
                                            name={
                                                variacaoPeso > 0
                                                    ? "trending-up"
                                                    : "trending-down"
                                            }
                                            size={12}
                                            color={
                                                variacaoPeso > 0
                                                    ? colors.warning
                                                    : colors.success
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.cardPesoVariacaoTexto,
                                                {
                                                    color:
                                                        variacaoPeso > 0
                                                            ? colors.warning
                                                            : colors.success,
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
                        <MiniGrafico
                            valores={valoresPeso}
                            largura={100}
                            altura={40}
                            cor={colors.text}
                        />
                    )}
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textMuted}
                    />
                </TouchableOpacity>

                {/* SECAO FICHAS */}
                <View style={styles.linhaSection}>
                    <Text style={[styles.section, { color: colors.text }]}>
                        Suas fichas
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/fichas")}>
                        <Text style={[styles.verTodas, { color: colors.textMuted }]}>
                            Ver todas
                        </Text>
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
                            style={[
                                styles.cardFicha,
                                cardStyle,
                                { width: cardWidth },
                            ]}
                            onPress={() =>
                                router.push({
                                    pathname: "/criarFicha",
                                    params: { idFicha: item.id },
                                })
                            }
                        >
                            <Ionicons
                                name="clipboard"
                                size={24}
                                color={colors.text}
                            />
                            <Text
                                style={[styles.cardNome, { color: colors.text }]}
                                numberOfLines={2}
                            >
                                {item.nome}
                            </Text>
                            <Text
                                style={[styles.cardQtd, { color: colors.textMuted }]}
                            >
                                {item.exercicios.length} ex.
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View
                            style={[
                                styles.cardVazio,
                                cardStyle,
                                { width: cardWidth * 1.4 },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.cardVazioTexto,
                                    { color: colors.textMuted },
                                ]}
                            >
                                Sem fichas ainda
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.botaoCriar,
                                    { backgroundColor: colors.accent },
                                ]}
                                onPress={() => router.push("/criarFicha")}
                            >
                                <Text
                                    style={[
                                        styles.botaoCriarTexto,
                                        { color: colors.accentText },
                                    ]}
                                >
                                    + Criar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />

                {/* SECAO GRAFICOS */}
                <View style={styles.linhaSection}>
                    <Text style={[styles.section, { color: colors.text }]}>
                        Seus gráficos
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/grafico")}>
                        <Text style={[styles.verTodas, { color: colors.textMuted }]}>
                            Ver todos
                        </Text>
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
                            style={[
                                styles.cardGrafico,
                                cardStyle,
                                { width: cardWidth * 1.15 },
                            ]}
                            onPress={() =>
                                router.push({
                                    pathname: "/grafico",
                                    params: { exercicioId: item.exercicio.id },
                                })
                            }
                        >
                            <View style={styles.cardGraficoHeader}>
                                <BodySilhueta
                                    area={item.exercicio.area}
                                    size={24}
                                    cor={colors.text}
                                    corBase={colors.textDim}
                                />
                                <View style={styles.cardGraficoInfo}>
                                    <Text
                                        style={[
                                            styles.cardNome,
                                            { color: colors.text },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.exercicio.nome}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.cardQtd,
                                            { color: colors.textMuted },
                                        ]}
                                    >
                                        {labelArea(item.exercicio.area)}
                                    </Text>
                                </View>
                            </View>
                            <MiniGrafico
                                valores={item.valores}
                                largura={cardWidth * 1.15 - 28}
                                altura={40}
                                cor={colors.text}
                            />
                            <View style={styles.cardGraficoRodape}>
                                <Text
                                    style={[
                                        styles.cardGraficoPR,
                                        { color: colors.text },
                                    ]}
                                >
                                    {item.prAtual !== null
                                        ? item.prAtual + " kg"
                                        : "—"}
                                </Text>
                                <Text
                                    style={[
                                        styles.cardGraficoLabel,
                                        { color: colors.textMuted },
                                    ]}
                                >
                                    PR
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View
                            style={[
                                styles.cardVazio,
                                cardStyle,
                                { width: cardWidth * 1.4 },
                            ]}
                        >
                            <Ionicons
                                name="stats-chart-outline"
                                size={22}
                                color={colors.textMuted}
                            />
                            <Text
                                style={[
                                    styles.cardVazioTexto,
                                    { color: colors.textMuted },
                                ]}
                            >
                                Sem PRs registrados
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.botaoCriar,
                                    { backgroundColor: colors.accent },
                                ]}
                                onPress={() => router.push("/exercicios")}
                            >
                                <Text
                                    style={[
                                        styles.botaoCriarTexto,
                                        { color: colors.accentText },
                                    ]}
                                >
                                    Registrar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />

                {/* SECAO ACOES */}
                <View style={styles.linhaSection}>
                    <Text style={[styles.section, { color: colors.text }]}>
                        Ações rápidas
                    </Text>
                </View>

                <View style={styles.acoesRapidas}>
                    <TouchableOpacity
                        style={[styles.botaoAcao, cardStyle]}
                        onPress={() => router.push("/criarFicha")}
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={26}
                            color={colors.text}
                        />
                        <Text
                            style={[styles.botaoAcaoTexto, { color: colors.text }]}
                        >
                            Nova ficha
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botaoAcao, cardStyle]}
                        onPress={() => router.push("/calendario")}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={26}
                            color={colors.text}
                        />
                        <Text
                            style={[styles.botaoAcaoTexto, { color: colors.text }]}
                        >
                            Calendário
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botaoAcao, cardStyle]}
                        onPress={() => router.push("/grafico")}
                    >
                        <Ionicons
                            name="stats-chart-outline"
                            size={26}
                            color={colors.text}
                        />
                        <Text
                            style={[styles.botaoAcaoTexto, { color: colors.text }]}
                        >
                            Gráficos
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ModalRegistrarTreino
                visivel={modalAberto}
                onFechar={() => setModalAberto(false)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    scrollContent: { paddingTop: 16, paddingBottom: 24 },
    saudacao: { fontFamily: "Inter_600SemiBold", fontSize: 22 },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        marginTop: 2,
    },
    cardStreak: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    streakIcone: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    streakInfo: { flex: 1 },
    streakLinha: { flexDirection: "row", alignItems: "baseline", gap: 6 },
    streakValor: { fontFamily: "Inter_600SemiBold", fontSize: 26 },
    streakLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
    streakSub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    botaoRegistrarTreino: {
        borderRadius: 12,
        padding: 14,
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    botaoRegistrarTreinoTexto: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
    },
    cardPeso: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        marginTop: 12,
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
    cardPesoLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
    cardPesoLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
    cardPesoValor: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
    cardPesoVariacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    cardPesoVariacaoTexto: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
    linhaSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
    },
    section: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    verTodas: { fontFamily: "Inter_400Regular", fontSize: 13 },
    listaCards: { gap: 12, paddingVertical: 4, paddingRight: 4 },
    cardFicha: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        height: 130,
        justifyContent: "space-between",
    },
    cardGrafico: {
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
    cardGraficoPR: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    cardGraficoLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
    cardNome: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
    cardQtd: { fontFamily: "Inter_400Regular", fontSize: 11 },
    cardVazio: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        height: 130,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    cardVazioTexto: { fontFamily: "Inter_400Regular", fontSize: 13 },
    botaoCriar: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    botaoCriarTexto: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
    acoesRapidas: { flexDirection: "row", gap: 8 },
    botaoAcao: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        gap: 6,
    },
    botaoAcaoTexto: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 11,
        textAlign: "center",
    },
})
