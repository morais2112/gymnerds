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
import {
    addRegistro,
    getRegistrosDoExercicio,
    getPRAtual,
    removeRegistro,
    subscribe,
} from "../src/data/prsStore"

export default function RegistrarPR() {
    // useLocalSearchParams - recebe o id do exercício
    const params = useLocalSearchParams<{ exercicioId?: string }>()

    // useState para o peso digitado
    const [peso, setPeso] = useState<string>("")

    // useState para a lista de registros
    const [registros, setRegistros] = useState<RegistroPR[]>(
        params.exercicioId ? getRegistrosDoExercicio(params.exercicioId) : []
    )

    // Encontra o exercício pelo id
    const exercicio: Exercicio | undefined = exercicios.find(
        (e) => e.id === params.exercicioId
    )

    // Atualiza a lista quando o store mudar
    useEffect(() => {
        const unsub = subscribe(() => {
            if (params.exercicioId) {
                setRegistros(getRegistrosDoExercicio(params.exercicioId))
            }
        })
        return unsub
    }, [params.exercicioId])

    // PR atual (maior peso registrado)
    const prAtual = params.exercicioId ? getPRAtual(params.exercicioId) : null

    // Salva o novo registro
    const salvar = () => {
        if (!params.exercicioId) return
        const valor = parseFloat(peso.replace(",", "."))
        if (isNaN(valor) || valor <= 0) {
            Alert.alert("Atenção", "Digite um peso válido (maior que zero).")
            return
        }
        const novo: RegistroPR = {
            id: String(Date.now()),
            exercicioId: params.exercicioId,
            peso: valor,
            data: new Date().toISOString(),
        }
        addRegistro(novo)
        setPeso("")
    }

    // Formata a data ISO para uma string amigável
    const formatarData = (iso: string): string => {
        const d = new Date(iso)
        const dia = String(d.getDate()).padStart(2, "0")
        const mes = String(d.getMonth() + 1).padStart(2, "0")
        const ano = d.getFullYear()
        return `${dia}/${mes}/${ano}`
    }

    // Caso não encontre o exercício
    if (!exercicio) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text style={styles.erro}>Exercício não encontrado.</Text>
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => router.back()}
                >
                    <Text style={styles.textoBotaoVoltar}>Voltar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.container}>
                    <View style={styles.headerCard}>
                        <Ionicons name="barbell" size={28} color="#ffffff" />
                        <View style={styles.headerInfo}>
                            <Text style={styles.exNome}>{exercicio.nome}</Text>
                            <Text style={styles.exArea}>{exercicio.area}</Text>
                        </View>
                        <View style={styles.prAtualBox}>
                            <Text style={styles.prAtualLabel}>PR atual</Text>
                            <Text style={styles.prAtualValor}>
                                {prAtual !== null ? `${prAtual} kg` : "—"}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.label}>Novo registro (kg)</Text>
                    <View style={styles.linhaInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 80"
                            placeholderTextColor="#777"
                            keyboardType="numeric"
                            value={peso}
                            onChangeText={setPeso}
                        />
                        <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
                            <Text style={styles.textoSalvar}>Salvar</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitulo}>
                        Histórico ({registros.length})
                    </Text>

                    {/* FlatList com o histórico de registros */}
                    <FlatList
                        data={registros}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.cardRegistro}>
                                <View>
                                    <Text style={styles.regPeso}>{item.peso} kg</Text>
                                    <Text style={styles.regData}>
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
                                        color="#ff4d4d"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.vazio}>
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
    safe: {
        flex: 1,
        backgroundColor: "#0f0f14",
    },
    flex: { flex: 1 },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
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
    headerInfo: {
        flex: 1,
    },
    exNome: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
    },
    exArea: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 2,
    },
    prAtualBox: {
        alignItems: "flex-end",
    },
    prAtualLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 11,
    },
    prAtualValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 18,
    },
    label: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 14,
        marginBottom: 6,
    },
    linhaInput: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 18,
    },
    input: {
        flex: 1,
        fontFamily: "Inter_400Regular",
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 44,
        color: "#ffffff",
        fontSize: 15,
    },
    botaoSalvar: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 18,
        justifyContent: "center",
        borderRadius: 10,
    },
    textoSalvar: {
        fontFamily: "Inter_600SemiBold",
        color: "#000000",
    },
    subtitulo: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
        marginBottom: 8,
    },
    cardRegistro: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 12,
        marginVertical: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    regPeso: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
    },
    regData: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 2,
    },
    botaoRemover: {
        padding: 6,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        textAlign: "center",
        marginTop: 24,
    },
    listaConteudo: {
        paddingBottom: 16,
    },
    erro: {
        fontFamily: "Inter_400Regular",
        color: "#ffffff",
        textAlign: "center",
        marginTop: 40,
    },
    botaoVoltar: {
        backgroundColor: "#ffffff",
        marginTop: 16,
        marginHorizontal: 60,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    textoBotaoVoltar: {
        fontFamily: "Inter_600SemiBold",
        color: "#000000",
    },
})
