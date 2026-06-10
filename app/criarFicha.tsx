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
import CardExercicioFicha from "../src/components/CardExercicioFicha"
import { ExercicioFicha } from "../src/types"
import {
    addFicha,
    getFichas,
    removeExercicioDaFicha,
    subscribe,
} from "../src/data/fichasStore"
import { getPRAtual } from "../src/data/prsStore"
import { useTheme } from "../src/theme/ThemeContext"

export default function CriarFicha() {
    const params = useLocalSearchParams<{ idFicha?: string }>()
    const { colors } = useTheme()

    const [nomeFicha, setNomeFicha] = useState<string>("")
    const [exerciciosFicha, setExerciciosFicha] = useState<ExercicioFicha[]>([])
    const [idFichaAtual, setIdFichaAtual] = useState<string | null>(
        params.idFicha ?? null
    )

    useEffect(() => {
        if (params.idFicha) {
            const f = getFichas().find((x) => x.id === params.idFicha)
            if (f) {
                setNomeFicha(f.nome)
                setExerciciosFicha(f.exercicios)
                setIdFichaAtual(f.id)
            }
        }
    }, [params.idFicha])

    useEffect(() => {
        const unsub = subscribe(() => {
            if (idFichaAtual) {
                const f = getFichas().find((x) => x.id === idFichaAtual)
                if (f) setExerciciosFicha(f.exercicios)
            }
        })
        return unsub
    }, [idFichaAtual])

    const adicionarExercicio = () => {
        if (!nomeFicha.trim()) {
            Alert.alert("Atenção", "Digite um nome para a ficha primeiro.")
            return
        }
        let id = idFichaAtual
        if (!id) {
            id = String(Date.now())
            addFicha({ id, nome: nomeFicha.trim(), exercicios: exerciciosFicha })
            setIdFichaAtual(id)
        }
        router.push({
            pathname: "/selecionarExercicio",
            params: { idFicha: id },
        })
    }

    const salvarFicha = () => {
        if (!nomeFicha.trim()) {
            Alert.alert("Atenção", "Digite um nome para a ficha.")
            return
        }
        if (!idFichaAtual) {
            const id = String(Date.now())
            addFicha({ id, nome: nomeFicha.trim(), exercicios: exerciciosFicha })
        }
        router.replace("/fichas")
    }

    const removerExercicio = (idExercicio: string) => {
        if (!idFichaAtual) return
        removeExercicioDaFicha(idFichaAtual, idExercicio)
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
                <View
                    style={[styles.container, { backgroundColor: colors.background }]}
                >
                    <Text style={[styles.label, { color: colors.text }]}>
                        Nome da ficha
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: colors.text, color: colors.text },
                        ]}
                        placeholder="Ex: Treino A - Peito e Tríceps"
                        placeholderTextColor={colors.textDim}
                        value={nomeFicha}
                        onChangeText={setNomeFicha}
                    />

                    <View style={styles.linhaBotoes}>
                        <TouchableOpacity
                            style={[
                                styles.botaoSecundario,
                                { borderColor: colors.text },
                            ]}
                            onPress={adicionarExercicio}
                        >
                            <Text
                                style={[
                                    styles.textoBotaoSecundario,
                                    { color: colors.text },
                                ]}
                            >
                                + Exercício
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.botaoSalvar,
                                { backgroundColor: colors.accent },
                            ]}
                            onPress={salvarFicha}
                        >
                            <Text
                                style={[
                                    styles.textoBotaoSalvar,
                                    { color: colors.accentText },
                                ]}
                            >
                                Salvar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.subtitulo, { color: colors.text }]}>
                        Exercícios da ficha ({exerciciosFicha.length})
                    </Text>

                    <FlatList
                        data={exerciciosFicha}
                        keyExtractor={(item) => item.exercicio.id}
                        renderItem={({ item }) => (
                            <CardExercicioFicha
                                item={item}
                                prAtual={getPRAtual(item.exercicio.id)}
                                onRemover={removerExercicio}
                            />
                        )}
                        ListEmptyComponent={
                            <Text
                                style={[styles.vazio, { color: colors.textMuted }]}
                            >
                                Nenhum exercício adicionado. Clique em "+ Exercício".
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
    label: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        fontFamily: "Inter_400Regular",
        borderWidth: 1.5,
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 14,
        fontSize: 15,
    },
    linhaBotoes: { flexDirection: "row", gap: 10, marginBottom: 14 },
    botaoSecundario: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    textoBotaoSecundario: { fontFamily: "Inter_600SemiBold" },
    botaoSalvar: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    textoBotaoSalvar: { fontFamily: "Inter_600SemiBold" },
    subtitulo: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        marginBottom: 8,
        marginTop: 4,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 24,
    },
    listaConteudo: { paddingBottom: 16 },
})
