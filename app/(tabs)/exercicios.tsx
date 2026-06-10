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
import BodySilhueta from "../../src/components/BodySilhueta"
import { AreaMuscular, Exercicio } from "../../src/types"
import { exercicios, areasMusculares } from "../../src/data/exercicios"
import { getPRAtual, subscribe } from "../../src/data/prsStore"
import { labelArea } from "../../src/data/labelsArea"
import { useTheme } from "../../src/theme/ThemeContext"

export default function ExerciciosTab() {
    const { width } = useWindowDimensions()
    const { colors } = useTheme()

    const [areaSelecionada, setAreaSelecionada] = useState<AreaMuscular | null>(null)
    const [versao, setVersao] = useState<number>(0)

    useEffect(() => {
        const unsub = subscribe(() => setVersao((v) => v + 1))
        return unsub
    }, [])

    const lista: Exercicio[] = useMemo(() => {
        if (!areaSelecionada) return exercicios
        return exercicios.filter((e) => e.area === areaSelecionada)
    }, [areaSelecionada])

    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.cabecalho, { paddingHorizontal: paddingH }]}>
                <Text style={[styles.titulo, { color: colors.text }]}>Meus PRs</Text>
                <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                    Toque num exercício para registrar seu peso máximo
                </Text>
            </View>

            <FiltroArea
                areas={areasMusculares}
                areaSelecionada={areaSelecionada}
                onSelecionar={setAreaSelecionada}
            />

            <FlatList
                style={styles.lista}
                data={lista}
                keyExtractor={(item) => item.id}
                extraData={versao}
                renderItem={({ item }) => {
                    const pr = getPRAtual(item.id)
                    return (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    marginHorizontal: paddingH,
                                },
                            ]}
                            onPress={() =>
                                router.push({
                                    pathname: "/registrarPR",
                                    params: { exercicioId: item.id },
                                })
                            }
                        >
                            <View
                                style={[
                                    styles.iconeBox,
                                    { backgroundColor: colors.surfaceAlt },
                                ]}
                            >
                                <BodySilhueta
                                    area={item.area}
                                    size={32}
                                    cor={colors.text}
                                    corBase={colors.textDim}
                                />
                            </View>
                            <View style={styles.cardEsquerda}>
                                <Text
                                    style={[styles.nome, { color: colors.text }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.nome}
                                </Text>
                                <Text
                                    style={[styles.area, { color: colors.textMuted }]}
                                >
                                    {labelArea(item.area)}
                                </Text>
                            </View>
                            <View style={styles.cardDireita}>
                                {pr !== null ? (
                                    <>
                                        <Text
                                            style={[
                                                styles.prValor,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {pr}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.prUnidade,
                                                { color: colors.textMuted },
                                            ]}
                                        >
                                            kg
                                        </Text>
                                    </>
                                ) : (
                                    <View style={styles.semPR}>
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={20}
                                            color={colors.textMuted}
                                        />
                                        <Text
                                            style={[
                                                styles.semPRTexto,
                                                { color: colors.textMuted },
                                            ]}
                                        >
                                            Sem PR
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )
                }}
                ListEmptyComponent={
                    <Text style={[styles.vazio, { color: colors.textMuted }]}>
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
    container: { flex: 1, paddingTop: 12 },
    cabecalho: { marginBottom: 4 },
    titulo: { fontFamily: "Inter_600SemiBold", fontSize: 22 },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        marginTop: 2,
    },
    lista: { flex: 1 },
    card: {
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        borderWidth: 1.5,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconeBox: {
        width: 50,
        height: 56,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cardEsquerda: { flex: 1 },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 4,
    },
    area: { fontFamily: "Inter_400Regular", fontSize: 12 },
    cardDireita: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 4,
        flexShrink: 0,
    },
    prValor: { fontFamily: "Inter_600SemiBold", fontSize: 20 },
    prUnidade: { fontFamily: "Inter_400Regular", fontSize: 13 },
    semPR: { flexDirection: "row", alignItems: "center", gap: 4 },
    semPRTexto: { fontFamily: "Inter_400Regular", fontSize: 12 },
    listaConteudo: { paddingTop: 4, paddingBottom: 24 },
    vazio: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 24,
    },
})
