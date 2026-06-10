import { useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Exercicio, RegistroPR } from "../src/types"
import { exercicios } from "../src/data/exercicios"
import { getRegistrosDoExercicio, getExerciciosComPR } from "../src/data/prsStore"
import { labelArea } from "../src/data/labelsArea"
import BodySilhueta from "../src/components/BodySilhueta"
import GraficoLinha from "../src/components/GraficoLinha"
import { useTheme } from "../src/theme/ThemeContext"

const carregarRegistrosAsync = async (
    exercicioId: string
): Promise<RegistroPR[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getRegistrosDoExercicio(exercicioId)
}

export default function Grafico() {
    const { width } = useWindowDimensions()
    const { colors } = useTheme()
    const params = useLocalSearchParams<{ exercicioId?: string }>()

    const [exercicioSelecionado, setExercicioSelecionado] = useState<Exercicio | null>(null)
    const [registros, setRegistros] = useState<RegistroPR[]>([])
    const [carregando, setCarregando] = useState<boolean>(false)

    const idsComPR = getExerciciosComPR()
    const exerciciosComPR: Exercicio[] = exercicios.filter((e) => idsComPR.includes(e.id))

    useEffect(() => {
        if (!params.exercicioId) return
        const ex = exercicios.find((e) => e.id === params.exercicioId)
        if (ex) setExercicioSelecionado(ex)
    }, [params.exercicioId])

    useEffect(() => {
        if (!exercicioSelecionado) return
        let cancelado = false

        const carregar = async () => {
            setCarregando(true)
            const dados = await carregarRegistrosAsync(exercicioSelecionado.id)
            if (!cancelado) {
                setRegistros(dados)
                setCarregando(false)
            }
        }

        carregar()
        return () => { cancelado = true }
    }, [exercicioSelecionado])

    const labelData = (iso: string): string => {
        const d = new Date(iso)
        return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0")
    }

    const pontosGrafico = [...registros]
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((r) => ({ valor: r.peso, label: labelData(r.data) }))

    const pesos = registros.map((r) => r.peso)
    const min = pesos.length > 0 ? Math.min(...pesos) : 0
    const max = pesos.length > 0 ? Math.max(...pesos) : 0
    const variacao = max - min
    const variacaoPct = min > 0 ? ((variacao / min) * 100).toFixed(1) : "0.0"

    const larguraGrafico = Math.min(width - 32, 500)
    const cardStyle = { backgroundColor: colors.surface, borderColor: colors.border }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["bottom"]}>
            {!exercicioSelecionado ? (
                <View style={styles.container}>
                    <Text style={[styles.titulo, { color: colors.text }]}>Escolha um exercício</Text>
                    <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                        Só aparecem exercícios em que você já registrou pelo menos um PR
                    </Text>

                    <FlatList
                        data={exerciciosComPR}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.cardSelecao, cardStyle]}
                                onPress={() => setExercicioSelecionado(item)}
                            >
                                <BodySilhueta area={item.area} size={32} cor={colors.text} corBase={colors.textDim} />
                                <View style={styles.info}>
                                    <Text style={[styles.nomeEx, { color: colors.text }]}>{item.nome}</Text>
                                    <Text style={[styles.areaEx, { color: colors.textMuted }]}>
                                        {labelArea(item.area)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={[styles.vazioBox, cardStyle]}>
                                <Text style={[styles.vazioTexto, { color: colors.textMuted }]}>
                                    Nenhum PR registrado ainda.
                                </Text>
                                <TouchableOpacity
                                    style={[styles.botaoIr, { backgroundColor: colors.accent }]}
                                    onPress={() => router.push("/exercicios")}
                                >
                                    <Text style={[styles.botaoIrTexto, { color: colors.accentText }]}>
                                        Registrar PR
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        contentContainerStyle={styles.listaConteudo}
                    />
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={[styles.headerCard, cardStyle]}>
                        <BodySilhueta area={exercicioSelecionado.area} size={48} cor={colors.text} corBase={colors.textDim} />
                        <View style={styles.headerInfo}>
                            <Text style={[styles.exNome, { color: colors.text }]}>
                                {exercicioSelecionado.nome}
                            </Text>
                            <Text style={[styles.exArea, { color: colors.textMuted }]}>
                                {labelArea(exercicioSelecionado.area)}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setExercicioSelecionado(null)}>
                            <Text style={[styles.trocar, { color: colors.textMuted }]}>Trocar</Text>
                        </TouchableOpacity>
                    </View>

                    {carregando ? (
                        <View style={styles.loading}>
                            <ActivityIndicator color={colors.text} />
                            <Text style={[styles.loadingTexto, { color: colors.textMuted }]}>
                                Carregando dados...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <GraficoLinha pontos={pontosGrafico} largura={larguraGrafico} cor={colors.text} />

                            {registros.length > 0 && (
                                <View style={styles.estatisticas}>
                                    <View style={[styles.estatBox, cardStyle]}>
                                        <Text style={[styles.estatLabel, { color: colors.textMuted }]}>Mínimo</Text>
                                        <Text style={[styles.estatValor, { color: colors.text }]}>{min} kg</Text>
                                    </View>
                                    <View style={[styles.estatBox, cardStyle]}>
                                        <Text style={[styles.estatLabel, { color: colors.textMuted }]}>Máximo</Text>
                                        <Text style={[styles.estatValor, { color: colors.text }]}>{max} kg</Text>
                                    </View>
                                    <View style={[styles.estatBox, cardStyle]}>
                                        <Text style={[styles.estatLabel, { color: colors.textMuted }]}>Evolução</Text>
                                        <Text style={[styles.estatValor, { color: colors.text }]}>+{variacaoPct}%</Text>
                                    </View>
                                </View>
                            )}

                            <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                                {registros.length} registro(s)
                            </Text>
                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1, padding: 16 },
    titulo: { fontFamily: "Inter_600SemiBold", fontSize: 20, marginBottom: 4 },
    subtitulo: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 12, marginBottom: 8 },
    headerCard: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },
    headerInfo: { flex: 1 },
    exNome: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    exArea: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    trocar: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
    loading: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12 },
    loadingTexto: { fontFamily: "Inter_400Regular", fontSize: 13 },
    estatisticas: { flexDirection: "row", gap: 10, marginTop: 16 },
    estatBox: { flex: 1, borderWidth: 1.5, borderRadius: 10, padding: 12, alignItems: "center" },
    estatLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
    estatValor: { fontFamily: "Inter_600SemiBold", fontSize: 18, marginTop: 2 },
    cardSelecao: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    info: { flex: 1 },
    nomeEx: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    areaEx: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    listaConteudo: { paddingBottom: 16, paddingTop: 8 },
    vazioBox: { borderWidth: 1.5, borderRadius: 12, padding: 24, alignItems: "center", marginTop: 12 },
    vazioTexto: { fontFamily: "Inter_400Regular", fontSize: 14, marginBottom: 12 },
    botaoIr: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
    botaoIrTexto: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
})
