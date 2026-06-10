import { useEffect, useState } from "react"
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Ficha } from "../types"
import { getFichas, subscribe as subFichas } from "../data/fichasStore"
import { addSessao } from "../data/sessaoStore"
import { useTheme } from "../theme/ThemeContext"

type Props = {
    visivel: boolean
    onFechar: () => void
}

const ModalRegistrarTreino = (props: Props) => {
    const { colors } = useTheme()
    const [fichas, setFichas] = useState<Ficha[]>(getFichas())
    const [fichaSelecionada, setFichaSelecionada] = useState<Ficha | null>(null)
    const [duracao, setDuracao] = useState<string>("60")

    useEffect(() => {
        const unsub = subFichas(() => setFichas([...getFichas()]))
        return unsub
    }, [])

    useEffect(() => {
        if (props.visivel) {
            setFichaSelecionada(null)
            setDuracao("60")
        }
    }, [props.visivel])

    const confirmar = () => {
        if (!fichaSelecionada) {
            Alert.alert("Atenção", "Selecione uma ficha.")
            return
        }
        const d = parseInt(duracao, 10)
        if (isNaN(d) || d <= 0 || d > 600) {
            Alert.alert("Atenção", "Duração deve estar entre 1 e 600 minutos.")
            return
        }
        addSessao({
            id: String(Date.now()),
            idFicha: fichaSelecionada.id,
            nomeFicha: fichaSelecionada.nome,
            data: new Date().toISOString(),
            duracaoMin: d,
        })
        props.onFechar()
    }

    return (
        <Modal
            visible={props.visivel}
            transparent
            animationType="fade"
            onRequestClose={props.onFechar}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <TouchableOpacity
                    style={styles.fundo}
                    activeOpacity={1}
                    onPress={props.onFechar}
                />
                <View
                    style={[
                        styles.caixa,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <View style={styles.header}>
                        <Ionicons name="checkmark-circle-outline" size={28} color={colors.success} />
                        <Text style={[styles.titulo, { color: colors.text }]}>
                            Registrar treino feito
                        </Text>
                    </View>
                    <Text style={[styles.subtitulo, { color: colors.textMuted }]}>
                        Qual ficha você treinou?
                    </Text>

                    <View style={styles.listaWrapper}>
                        <FlatList
                            data={fichas}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.itemFicha,
                                        {
                                            backgroundColor: colors.surfaceAlt,
                                            borderColor:
                                                fichaSelecionada?.id === item.id
                                                    ? colors.success
                                                    : "transparent",
                                        },
                                    ]}
                                    onPress={() => setFichaSelecionada(item)}
                                >
                                    <Ionicons
                                        name={
                                            fichaSelecionada?.id === item.id
                                                ? "radio-button-on"
                                                : "radio-button-off"
                                        }
                                        size={18}
                                        color={
                                            fichaSelecionada?.id === item.id
                                                ? colors.success
                                                : colors.textMuted
                                        }
                                    />
                                    <Text
                                        style={[styles.itemFichaNome, { color: colors.text }]}
                                        numberOfLines={1}
                                    >
                                        {item.nome}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={[styles.vazio, { color: colors.textMuted }]}>
                                    Sem fichas. Crie uma primeiro.
                                </Text>
                            }
                        />
                    </View>

                    <Text style={[styles.label, { color: colors.textMuted }]}>
                        Duração (min)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { color: colors.text, borderColor: colors.text },
                        ]}
                        value={duracao}
                        onChangeText={setDuracao}
                        keyboardType="numeric"
                        placeholder="60"
                        placeholderTextColor={colors.textDim}
                        maxLength={3}
                    />

                    <View style={styles.linhaBotoes}>
                        <TouchableOpacity
                            style={[styles.botaoCancelar, { borderColor: colors.textMuted }]}
                            onPress={props.onFechar}
                        >
                            <Text style={[styles.botaoCancelarTexto, { color: colors.text }]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoConfirmar, { backgroundColor: colors.accent }]}
                            onPress={confirmar}
                        >
                            <Text style={[styles.botaoConfirmarTexto, { color: colors.accentText }]}>
                                Salvar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default ModalRegistrarTreino

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    fundo: { ...StyleSheet.absoluteFillObject },
    caixa: {
        borderRadius: 16,
        padding: 18,
        width: "100%",
        maxWidth: 400,
        borderWidth: 1.5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    titulo: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    subtitulo: { fontFamily: "Inter_400Regular", fontSize: 13, marginBottom: 8 },
    listaWrapper: { maxHeight: 200, marginBottom: 16 },
    itemFicha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 1.5,
    },
    itemFichaNome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        flex: 1,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        textAlign: "center",
        paddingVertical: 12,
    },
    label: { fontFamily: "Inter_400Regular", fontSize: 12, marginBottom: 4 },
    input: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: "center",
        marginBottom: 18,
    },
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
