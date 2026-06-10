import { useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Exercicio, RegistroPR } from "../src/types"
import { exercicios } from "../src/data/exercicios"
import { labelArea } from "../src/data/labelsArea"
import BodySilhueta from "../src/components/BodySilhueta"
import {
    addRegistro,
    getRegistrosDoExercicio,
    getPRAtual,
    removeRegistro,
    subscribe,
} from "../src/data/prsStore"
import { useTheme } from "../src/theme/ThemeContext"

export default function RegistrarPR() {
    const params = useLocalSearchParams<{ exercicioId?: string }>()
    const { colors } = useTheme()

    const [peso, setPeso] = useState<string>("")
    const [registros, setRegistros] = useState<RegistroPR[]>(
        params.exercicioId ? getRegistrosDoExercicio(params.exercicioId) : []
    )

    const exercicio: Exercicio | undefined = exercicios.find(
        (e) => e.id === params.exercicioId
    )

    useEffect(() => {
        const unsub = subscribe(() => {
            if (params.exercicioId) {
                setRegistros(getRegistrosDoExercicio(params.exercicioId))
            }
        })
        return unsub
    }, [params.exercicioId])

    const prAtual = params.exercicioId ? getPRAtual(params.exercicioId) : null

    const salvar = () => {
        if (!params.exercicioId) return
        const valor = parseFloat(peso.replace(",", "."))
        if (isNaN(valor) || valor <= 0) {
            Alert.alert("Atenção", "Digite um peso válido (maior que zero).")
            return
        }
        addRegistro({
            id: String(Date.now()),
            exercicioId: params.exercicioId,
            peso: valor,
            data: new Date().toISOString(),
        })
        setPeso("")
    }

    const formatarData = (iso: string): string => {
        const d = new Date(iso)
        return (
            String(d.getDate()).padStart(2, "0") +
            "/" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "/" +
            d.getFullYear()
        )
    }

    if (!exercicio) {
        return (
            <SafeAreaView
                style={[styles.safe, { backgroundColor: colors.background }]}
            >
                <Text style={[styles.erro, { color: colors.text }]}>
                    Exercício não encontrado.
                </Text>
                <TouchableOpacity
                    style={[
                        styles.botaoVoltar,
                        { backgroundColor: colors.accent },
                    ]}
                    onPress={() => router.back()}
                >
                    <Text
                        style={[
                            styles.textoBotaoVoltar,
                            { color: colors.accentText },
                        ]}
                    >
                        Voltar
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView
            style={[styles.safe, { backgroundColor: colors.background }]}
            edges={["bottom"]}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.container}>
                    <View
                        style={[
                            styles.headerCard,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <BodySilhueta
                            area={exercicio.area}
                            size={48}
                            cor={colors.text}
                            corBase={colors.textDim}
                        />
                        <View style={styles.headerInfo}>
                            <Text style={[styles.exNome, { color: colors.text }]}>
                                {exercicio.nome}
                            </Text>
                            <Text style={[styles.exArea, { color: colors.textMuted }]}>
                                {labelArea(exercicio.area)}
                            </Text>
                        </View>
                        <View style={styles.prAtualBox}>
                            <Text
                                style={[
                                    styles.prAtualLabel,
                                    { color: colors.textMuted },
                                ]}
                            >
                                PR atual
                            </Text>
                            <Text
                                style={[styles.prAtualValor, { color: colors.text }]}
                            >
                                {prAtual !== null ? prAtual + " kg" : "-"}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.label, { color: colors.text }]}>
                        Novo registro (kg)
                    </Text>
                    <View style={styles.linhaInput}>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: colors.text, color: colors.text },
                            ]}
                            placeholder="Ex: 80"
                            placeholderTextColor={colors.textDim}
                            keyboardType="numeric"
                            value={peso}
                            onChangeText={setPeso}
                        />
                        <TouchableOpacity
                            style={[
                                styles.botaoSalvar,
                                { backgroundColor: colors.accent },
                            ]}
                            onPress={salvar}
                        >
                            <Text
                                style={[
                                    styles.textoSalvar,
                                    { color: colors.accentText },
                                ]}
                            >
                                Salvar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.linhaHistorico}>
                        <Text style={[styles.subtitulo, { color: colors.text }]}>
                            Histórico ({registros.length})
                        </Text>
                        {registros.length > 0 && (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/grafico",
                                        params: { exercicioId: exercicio.id },
                                    })
                                }
                                style={[
                                    styles.botaoGrafico,
                                    { backgroundColor: colors.accent },
                                ]}
                            >
                                <Ionicons
                                    name="trending-up"
                                    size={14}
                                    color={colors.accentText}
                                />
                                <Text
                                    style={[
                                        styles.botaoGraficoTexto,
                                        { color: colors.accentText },
                                    ]}
                                >
                                    Ver gráfico
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={registros}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.cardRegistro,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <View>
                                    <Text
                                        style={[styles.regPeso, { color: colors.text }]}
                                    >
                                        {item.peso} kg
                                    </Text>
                                    <Text
                                        style={[
                                            styles.regData,
                                            { color: colors.textMuted },
                                        ]}
                                    >
                                        {formatarData(item.data)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeRegistro(item.id)}
                                    style={styles.botaoRemover}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={20}
                                        color={colors.danger}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={[styles.vazio, { color: colors.textMuted }]}>
                                Nenhum registro ainda. Adicione o primeiro acima.
                            </Text>
                        }
                        contentContainerStyle={styles.listaConteudo}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
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
    prAtualBox: { alignItems: "flex-end" },
    prAtualLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
    prAtualValor: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
    label: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        marginBottom: 6,
    },
    linhaInput: { flexDirection: "row", gap: 10, marginBottom: 18 },
    input: {
        flex: 1,
        fontFamily: "Inter_400Regular",
        borderWidth: 1.5,
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 44,
        fontSize: 15,
    },
    botaoSalvar: {
        paddingHorizontal: 18,
        justifyContent: "center",
        borderRadius: 10,
    },
    textoSalvar: { fontFamily: "Inter_600SemiBold" },
    subtitulo: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    linhaHistorico: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    botaoGrafico: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    botaoGraficoTexto: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
    cardRegistro: {
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 12,
        marginVertical: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    regPeso: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    regData: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    botaoRemover: { padding: 6 },
    vazio: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 24,
    },
    listaConteudo: { paddingBottom: 16 },
    erro: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 40,
    },
    botaoVoltar: {
        marginTop: 16,
        marginHorizontal: 60,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    textoBotaoVoltar: { fontFamily: "Inter_600SemiBold" },
})
