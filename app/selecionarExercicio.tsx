import { useState, useMemo } from "react"
import {
    StyleSheet,
    Text,
    FlatList,
    Modal,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import CardExercicio from "../src/components/CardExercicio"
import FiltroArea from "../src/components/FiltroArea"
import BodySilhueta from "../src/components/BodySilhueta"
import { AreaMuscular, Exercicio } from "../src/types"
import { exercicios, areasMusculares } from "../src/data/exercicios"
import { addExercicioNaFicha } from "../src/data/fichasStore"
import { getPRAtual } from "../src/data/prsStore"
import { labelArea } from "../src/data/labelsArea"
import { useTheme } from "../src/theme/ThemeContext"

export default function SelecionarExercicio() {
    const params = useLocalSearchParams<{ idFicha?: string }>()
    const { colors } = useTheme()

    const [areaSelecionada, setAreaSelecionada] = useState<AreaMuscular | null>(null)
    const [exParaConfigurar, setExParaConfigurar] = useState<Exercicio | null>(null)
    const [series, setSeries] = useState<string>("3")
    const [repeticoes, setRepeticoes] = useState<string>("10")

    const lista: Exercicio[] = useMemo(() => {
        if (!areaSelecionada) return exercicios
        return exercicios.filter((e) => e.area === areaSelecionada)
    }, [areaSelecionada])

    const abrirModal = (ex: Exercicio) => {
        setExParaConfigurar(ex)
        setSeries("3")
        setRepeticoes("10")
    }

    const fecharModal = () => setExParaConfigurar(null)

    const confirmar = () => {
        if (!exParaConfigurar || !params.idFicha) return
        const s = parseInt(series, 10)
        const r = parseInt(repeticoes, 10)
        if (isNaN(s) || s <= 0 || s > 99) {
            Alert.alert("Atenção", "Séries deve ser um número entre 1 e 99.")
            return
        }
        if (isNaN(r) || r <= 0 || r > 999) {
            Alert.alert("Atenção", "Repetições deve ser um número entre 1 e 999.")
            return
        }
        addExercicioNaFicha(params.idFicha, exParaConfigurar, s, r)
        fecharModal()
        router.back()
    }

    const prAtualModal =
        exParaConfigurar !== null ? getPRAtual(exParaConfigurar.id) : null

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={["bottom"]}
        >
            <Text style={[styles.titulo, { color: colors.text }]}>
                Filtrar por área muscular
            </Text>

            <FiltroArea
                areas={areasMusculares}
                areaSelecionada={areaSelecionada}
                onSelecionar={setAreaSelecionada}
            />

            <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                {lista.length} exercício(s){" "}
                {areaSelecionada ? `em ${labelArea(areaSelecionada)}` : "no total"}
            </Text>

            <FlatList
                data={lista}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CardExercicio exercicio={item} onPress={abrirModal} />
                )}
                ListEmptyComponent={
                    <Text style={[styles.vazio, { color: colors.textMuted }]}>
                        Nenhum exercício para essa área.
                    </Text>
                }
                contentContainerStyle={styles.listaConteudo}
            />

            <Modal
                visible={exParaConfigurar !== null}
                transparent
                animationType="fade"
                onRequestClose={fecharModal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={styles.modalFundo}
                        activeOpacity={1}
                        onPress={fecharModal}
                    />
                    <View
                        style={[
                            styles.modalConteudo,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        {exParaConfigurar && (
                            <>
                                <View
                                    style={[
                                        styles.modalHeader,
                                        { borderBottomColor: colors.border },
                                    ]}
                                >
                                    <BodySilhueta
                                        area={exParaConfigurar.area}
                                        size={44}
                                        cor={colors.text}
                                        corBase={colors.textDim}
                                    />
                                    <View style={styles.modalHeaderInfo}>
                                        <Text
                                            style={[
                                                styles.modalNome,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {exParaConfigurar.nome}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.modalArea,
                                                { color: colors.textMuted },
                                            ]}
                                        >
                                            {labelArea(exParaConfigurar.area)}
                                        </Text>
                                    </View>
                                    <View style={styles.modalPRBox}>
                                        <Text
                                            style={[
                                                styles.modalPRLabel,
                                                { color: colors.textMuted },
                                            ]}
                                        >
                                            PR
                                        </Text>
                                        <Text
                                            style={[
                                                styles.modalPRValor,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {prAtualModal !== null
                                                ? prAtualModal + " kg"
                                                : "—"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.linhaInputs}>
                                    <View style={styles.campo}>
                                        <Text
                                            style={[
                                                styles.campoLabel,
                                                { color: colors.textMuted },
                                            ]}
                                        >
                                            Séries
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.campoInput,
                                                {
                                                    color: colors.text,
                                                    borderColor: colors.text,
                                                },
                                            ]}
                                            value={series}
                                            onChangeText={setSeries}
                                            keyboardType="numeric"
                                            placeholder="3"
                                            placeholderTextColor={colors.textDim}
                                            maxLength={2}
                                        />
                                    </View>
                                    <Text style={[styles.x, { color: colors.textDim }]}>
                                        ×
                                    </Text>
                                    <View style={styles.campo}>
                                        <Text
                                            style={[
                                                styles.campoLabel,
                                                { color: colors.textMuted },
                                            ]}
                                        >
                                            Repetições
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.campoInput,
                                                {
                                                    color: colors.text,
                                                    borderColor: colors.text,
                                                },
                                            ]}
                                            value={repeticoes}
                                            onChangeText={setRepeticoes}
                                            keyboardType="numeric"
                                            placeholder="10"
                                            placeholderTextColor={colors.textDim}
                                            maxLength={3}
                                        />
                                    </View>
                                </View>

                                <View style={styles.linhaBotoes}>
                                    <TouchableOpacity
                                        style={[
                                            styles.botaoCancelar,
                                            { borderColor: colors.textMuted },
                                        ]}
                                        onPress={fecharModal}
                                    >
                                        <Text
                                            style={[
                                                styles.botaoCancelarTexto,
                                                { color: colors.text },
                                            ]}
                                        >
                                            Cancelar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.botaoConfirmar,
                                            { backgroundColor: colors.accent },
                                        ]}
                                        onPress={confirmar}
                                    >
                                        <Text
                                            style={[
                                                styles.botaoConfirmarTexto,
                                                { color: colors.accentText },
                                            ]}
                                        >
                                            Adicionar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 8 },
    titulo: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        marginHorizontal: 16,
        marginTop: 6,
    },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 8,
        fontSize: 12,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 24,
    },
    listaConteudo: { paddingBottom: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalFundo: { ...StyleSheet.absoluteFillObject },
    modalConteudo: {
        borderRadius: 16,
        padding: 18,
        width: "100%",
        maxWidth: 400,
        borderWidth: 1.5,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },
    modalHeaderInfo: { flex: 1 },
    modalNome: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    modalArea: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    modalPRBox: { alignItems: "flex-end" },
    modalPRLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
    modalPRValor: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    linhaInputs: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 20,
    },
    campo: { flex: 1 },
    campoLabel: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        marginBottom: 6,
    },
    campoInput: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 20,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: "center",
    },
    x: { fontFamily: "Inter_600SemiBold", fontSize: 20, paddingBottom: 8 },
    linhaBotoes: { flexDirection: "row", gap: 10 },
    botaoCancelar: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    botaoCancelarTexto: { fontFamily: "Inter_600SemiBold" },
    botaoConfirmar: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    botaoConfirmarTexto: { fontFamily: "Inter_600SemiBold" },
})
