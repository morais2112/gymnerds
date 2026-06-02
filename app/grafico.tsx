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
import { Exercicio, RegistroPR } from "../src/types"
import { exercicios } from "../src/data/exercicios"
import { getRegistrosDoExercicio, getExerciciosComPR } from "../src/data/prsStore"
import { labelArea } from "../src/data/labelsArea"
import BodySilhueta from "../src/components/BodySilhueta"
import GraficoLinha from "../src/components/GraficoLinha"

// Funcao async (Aula 7) - simula busca de dados para demonstrar async/await
// Em apps reais com API remota, aqui teria um fetch()
const carregarRegistrosAsync = async (
    exercicioId: string
): Promise<RegistroPR[]> => {
    // simula pequeno delay para mostrar o loading
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getRegistrosDoExercicio(exercicioId)
}

export default function Grafico() {
    const { width } = useWindowDimensions()
    // useLocalSearchParams - recebe id do exercicio opcional (Aula 6)
    const params = useLocalSearchParams<{ exercicioId?: string }>()

    // useState (Aula 4)
    const [exercicioSelecionado, setExercicioSelecionado] = useState<
        Exercicio | null
    >(null)
    const [registros, setRegistros] = useState<RegistroPR[]>([])
    const [carregando, setCarregando] = useState<boolean>(false)

    // Lista os exercicios que tem PR registrado (busca no SQLite)
    const idsComPR = getExerciciosComPR()
    const exerciciosComPR: Exercicio[] = exercicios.filter((e) =>
        idsComPR.includes(e.id)
    )

    // useEffect com dependencia - roda quando exercicioId mudar (Aula 4 / 7)
    useEffect(() => {
        if (!params.exercicioId) return
        const ex = exercicios.find((e) => e.id === params.exercicioId)
        if (ex) setExercicioSelecionado(ex)
    }, [params.exercicioId])

    // useEffect com cleanup - carrega registros async quando exercicio mudar
    useEffect(() => {
        if (!exercicioSelecionado) return

        // flag de cancelamento (cleanup pra evitar setState apos unmount)
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

        // cleanup (Aula 4)
        return () => {
            cancelado = true
        }
    }, [exercicioSelecionado])

    // Formata data ISO para "dd/mm"
    const labelData = (iso: string): string => {
        const d = new Date(iso)
        const dia = String(d.getDate()).padStart(2, "0")
        const mes = String(d.getMonth() + 1).padStart(2, "0")
        return dia + "/" + mes
    }

    // Prepara os pontos para o grafico (ordem cronologica: antigo -> recente)
    const pontosGrafico = [...registros]
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((r) => ({ valor: r.peso, label: labelData(r.data) }))

    // Calcula min, max e variacao para mostrar estatisticas
    const pesos = registros.map((r) => r.peso)
    const min = pesos.length > 0 ? Math.min(...pesos) : 0
    const max = pesos.length > 0 ? Math.max(...pesos) : 0
    const variacao = max - min
    const variacaoPct = min > 0 ? ((variacao / min) * 100).toFixed(1) : "0.0"

    const larguraGrafico = Math.min(width - 32, 500)

    return (
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
            {/* Se nao selecionou exercicio, mostra a lista pra escolher */}
            {!exercicioSelecionado ? (
                <View style={styles.container}>
                    <Text style={styles.titulo}>Escolha um exercício</Text>
                    <Text style={styles.subtitulo}>
                        Só aparecem exercícios em que você já registrou pelo menos um PR
                    </Text>

                    {/* FlatList com os exercicios que tem PR (Aula 6) */}
                    <FlatList
                        data={exerciciosComPR}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.cardSelecao}
                                onPress={() => setExercicioSelecionado(item)}
                            >
                                <BodySilhueta area={item.area} size={32} />
                                <View style={styles.info}>
                                    <Text style={styles.nomeEx}>{item.nome}</Text>
                                    <Text style={styles.areaEx}>{labelArea(item.area)}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.vazioBox}>
                                <Text style={styles.vazioTexto}>
                                    Nenhum PR registrado ainda.
                                </Text>
                                <TouchableOpacity
                                    style={styles.botaoIr}
                                    onPress={() => router.push("/exercicios")}
                                >
                                    <Text style={styles.botaoIrTexto}>Registrar PR</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        contentContainerStyle={styles.listaConteudo}
                    />
                </View>
            ) : (
                // Modo grafico: mostra o grafico do exercicio selecionado
                <View style={styles.container}>
                    <View style={styles.headerCard}>
                        <BodySilhueta area={exercicioSelecionado.area} size={48} />
                        <View style={styles.headerInfo}>
                            <Text style={styles.exNome}>{exercicioSelecionado.nome}</Text>
                            <Text style={styles.exArea}>
                                {labelArea(exercicioSelecionado.area)}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setExercicioSelecionado(null)}>
                            <Text style={styles.trocar}>Trocar</Text>
                        </TouchableOpacity>
                    </View>

                    {carregando ? (
                        <View style={styles.loading}>
                            <ActivityIndicator color="#ffffff" />
                            <Text style={styles.loadingTexto}>Carregando dados...</Text>
                        </View>
                    ) : (
                        <>
                            <GraficoLinha pontos={pontosGrafico} largura={larguraGrafico} />

                            {/* Estatisticas (so se tiver pelo menos 1 registro) */}
                            {registros.length > 0 && (
                                <View style={styles.estatisticas}>
                                    <View style={styles.estatBox}>
                                        <Text style={styles.estatLabel}>Mínimo</Text>
                                        <Text style={styles.estatValor}>{min} kg</Text>
                                    </View>
                                    <View style={styles.estatBox}>
                                        <Text style={styles.estatLabel}>Máximo</Text>
                                        <Text style={styles.estatValor}>{max} kg</Text>
                                    </View>
                                    <View style={styles.estatBox}>
                                        <Text style={styles.estatLabel}>Evolução</Text>
                                        <Text style={styles.estatValor}>+{variacaoPct}%</Text>
                                    </View>
                                </View>
                            )}

                            <Text style={styles.subtitulo}>
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
    safe: { flex: 1, backgroundColor: "#0f0f14" },
    container: { flex: 1, padding: 16 },
    titulo: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 20, marginBottom: 4 },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 12,
        marginBottom: 8,
    },
    headerCard: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },
    headerInfo: { flex: 1 },
    exNome: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 16 },
    exArea: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 12, marginTop: 2 },
    trocar: { fontFamily: "Inter_600SemiBold", color: "#aaaaaa", fontSize: 13 },
    loading: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12 },
    loadingTexto: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 13 },
    estatisticas: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16,
    },
    estatBox: {
        flex: 1,
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
    },
    estatLabel: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 11 },
    estatValor: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 18, marginTop: 2 },
    cardSelecao: {
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
    info: { flex: 1 },
    nomeEx: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 15 },
    areaEx: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 12, marginTop: 2 },
    listaConteudo: { paddingBottom: 16, paddingTop: 8 },
    vazioBox: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        marginTop: 12,
    },
    vazioTexto: { fontFamily: "Inter_400Regular", color: "#aaaaaa", fontSize: 14, marginBottom: 12 },
    botaoIr: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
    },
    botaoIrTexto: { fontFamily: "Inter_600SemiBold", color: "#000000", fontSize: 14 },
})
