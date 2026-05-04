import { useEffect, useMemo, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import FiltroArea from "../../src/components/FiltroArea"
import { AreaMuscular, Exercicio } from "../../src/types"
import { exercicios, areasMusculares } from "../../src/data/exercicios"
import { getPRAtual, subscribe } from "../../src/data/prsStore"

export default function ExerciciosTab() {
    const { width } = useWindowDimensions()

    // useState - filtro de área e contador de mudanças (para refazer render)
    const [areaSelecionada, setAreaSelecionada] = useState<AreaMuscular | null>(
        null
    )
    const [versao, setVersao] = useState<number>(0)

    // Quando o store de PRs mudar, incrementa versão para forçar re-render
    useEffect(() => {
        const unsub = subscribe(() => setVersao((v) => v + 1))
        return unsub
    }, [])

    // Aplica o filtro de área na lista
    const lista: Exercicio[] = useMemo(() => {
        if (!areaSelecionada) return exercicios
        return exercicios.filter((e) => e.area === areaSelecionada)
    }, [areaSelecionada])

    // Padding horizontal proporcional para telas grandes não ficarem com cards gigantes
    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={[styles.cabecalho, { paddingHorizontal: paddingH }]}>
                <Text style={styles.titulo}>Meus PRs</Text>
                <Text style={styles.subtitulo}>
                    Toque num exercício para registrar seu peso máximo
                </Text>
            </View>

            {/* Filtro horizontal com altura fixa */}
            <FiltroArea
                areas={areasMusculares}
                areaSelecionada={areaSelecionada}
                onSelecionar={setAreaSelecionada}
            />

            {/* Lista vertical ocupa todo o espaço que sobra */}
            <FlatList
                style={styles.lista}
                data={lista}
                keyExtractor={(item) => item.id}
                extraData={versao}
                renderItem={({ item }) => {
                    const pr = getPRAtual(item.id)
                    return (
                        <TouchableOpacity
                            style={[styles.card, { marginHorizontal: paddingH }]}
                            onPress={() =>
                                router.push({
                                    pathname: "/registrarPR",
                                    params: { exercicioId: item.id },
                                })
                            }
                        >
                            <View style={styles.cardEsquerda}>
                                <Text
                                    style={styles.nome}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.nome}
                                </Text>
                                <Text style={styles.area}>{item.area}</Text>
                            </View>

                            <View style={styles.cardDireita}>
                                {pr !== null ? (
                                    <>
                                        <Text style={styles.prValor}>{pr}</Text>
                                        <Text style={styles.prUnidade}>kg</Text>
                                    </>
                                ) : (
                                    <View style={styles.semPR}>
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={20}
                                            color="#aaaaaa"
                                        />
                                        <Text style={styles.semPRTexto}>Sem PR</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )
                }}
                ListEmptyComponent={
                    <Text style={styles.vazio}>
                        Nenhum exercício para essa área.
                    </Text>
                }
                contentContainerStyle={styles.listaConteudo}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f14",
        paddingTop: 12,
    },
    cabecalho: {
        marginBottom: 4,
    },
    titulo: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 22,
    },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
        marginTop: 2,
    },
    lista: {
        flex: 1,
    },
    card: {
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        padding: 14,
        marginVertical: 6,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardEsquerda: {
        flex: 1,
        marginRight: 10,
    },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        color: "#ffffff",
        marginBottom: 4,
    },
    area: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        color: "#aaaaaa",
    },
    cardDireita: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 4,
        flexShrink: 0,
    },
    prValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 20,
    },
    prUnidade: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
    },
    semPR: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    semPRTexto: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
    },
    listaConteudo: {
        paddingTop: 4,
        paddingBottom: 24,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        textAlign: "center",
        marginTop: 24,
    },
})
