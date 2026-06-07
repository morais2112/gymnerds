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
    useWindowDimensions,
    ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Perfil, RegistroPeso } from "../../src/types"
import {
    addRegistro,
    getRegistros,
    getPesoAtual,
    getPesoInicial,
    removeRegistro,
    subscribe as subPesos,
} from "../../src/data/pesoStore"
import {
    getPerfil,
    setPerfil,
    subscribe as subPerfil,
} from "../../src/data/perfilStore"
import {
    calcularIMC,
    classificarIMC,
    corClassificacao,
} from "../../src/data/imcCalc"
import GraficoLinha from "../../src/components/GraficoLinha"

export default function MeusDados() {
    const { width } = useWindowDimensions()

    // useState para o input de novo peso
    const [novoPeso, setNovoPeso] = useState<string>("")
    const [registros, setRegistros] = useState<RegistroPeso[]>(getRegistros())

    // useState para o form de perfil (altura e idade sao editaveis)
    const [perfil, setPerfilLocal] = useState<Perfil>(getPerfil())
    const [alturaInput, setAlturaInput] = useState<string>(
        perfil.altura !== null ? String(perfil.altura) : ""
    )
    const [idadeInput, setIdadeInput] = useState<string>(
        perfil.idade !== null ? String(perfil.idade) : ""
    )

    // useEffect: escuta mudancas dos 2 stores (Aula 4)
    useEffect(() => {
        const unsubW = subPesos(() => setRegistros(getRegistros()))
        const unsubP = subPerfil(() => {
            const p = getPerfil()
            setPerfilLocal(p)
            setAlturaInput(p.altura !== null ? String(p.altura) : "")
            setIdadeInput(p.idade !== null ? String(p.idade) : "")
        })
        return () => {
            unsubW()
            unsubP()
        }
    }, [])

    const pesoAtual = getPesoAtual()
    const pesoInicial = getPesoInicial()
    const variacao =
        pesoAtual !== null && pesoInicial !== null ? pesoAtual - pesoInicial : null

    // Calcula o IMC com peso atual e altura do perfil
    const imc = calcularIMC(pesoAtual, perfil.altura)
    const classif = imc !== null ? classificarIMC(imc) : null
    const corClass = classif ? corClassificacao(classif) : "#aaaaaa"

    const formatarData = (iso: string): string => {
        const d = new Date(iso)
        const dia = String(d.getDate()).padStart(2, "0")
        const mes = String(d.getMonth() + 1).padStart(2, "0")
        const ano = d.getFullYear()
        return dia + "/" + mes + "/" + ano
    }

    const labelData = (iso: string): string => {
        const d = new Date(iso)
        return (
            String(d.getDate()).padStart(2, "0") +
            "/" +
            String(d.getMonth() + 1).padStart(2, "0")
        )
    }

    const salvarPeso = () => {
        const valor = parseFloat(novoPeso.replace(",", "."))
        if (isNaN(valor) || valor <= 0 || valor > 500) {
            Alert.alert("Atenção", "Digite um peso válido (entre 0 e 500 kg).")
            return
        }
        addRegistro({
            id: String(Date.now()),
            peso: valor,
            data: new Date().toISOString(),
        })
        setNovoPeso("")
    }

    const salvarPerfil = () => {
        const a = alturaInput.trim() === "" ? null : parseFloat(alturaInput.replace(",", "."))
        const i = idadeInput.trim() === "" ? null : parseInt(idadeInput, 10)
        if (a !== null && (isNaN(a) || a < 50 || a > 250)) {
            Alert.alert("Atenção", "Altura deve estar entre 50 e 250 cm.")
            return
        }
        if (i !== null && (isNaN(i) || i < 1 || i > 120)) {
            Alert.alert("Atenção", "Idade deve estar entre 1 e 120 anos.")
            return
        }
        setPerfil(a, i)
        Alert.alert("Salvo", "Seu perfil foi atualizado.")
    }

    const pontosGrafico = [...registros]
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((r) => ({ valor: r.peso, label: labelData(r.data) }))

    const larguraGrafico = Math.min(width - 32, 500)

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* CARD PERFIL: altura + idade */}
                <Text style={styles.section}>Perfil</Text>
                <View style={styles.cardPerfil}>
                    <View style={styles.linhaCampos}>
                        <View style={styles.campo}>
                            <Text style={styles.campoLabel}>Altura (cm)</Text>
                            <TextInput
                                style={styles.campoInput}
                                placeholder="Ex: 175"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={alturaInput}
                                onChangeText={setAlturaInput}
                                maxLength={5}
                            />
                        </View>
                        <View style={styles.campo}>
                            <Text style={styles.campoLabel}>Idade</Text>
                            <TextInput
                                style={styles.campoInput}
                                placeholder="Ex: 25"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={idadeInput}
                                onChangeText={setIdadeInput}
                                maxLength={3}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.botaoPerfil} onPress={salvarPerfil}>
                        <Text style={styles.textoBotaoPerfil}>Salvar perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* CARD IMC (so aparece se peso e altura existem) */}
                {imc !== null && classif && (
                    <>
                        <Text style={styles.section}>IMC</Text>
                        <View style={[styles.cardIMC, { borderColor: corClass }]}>
                            <View style={styles.imcEsquerda}>
                                <Text style={styles.imcValor}>{imc.toFixed(1)}</Text>
                                <Text style={styles.imcUnidade}>kg/m²</Text>
                            </View>
                            <View style={styles.imcDireita}>
                                <Text style={styles.imcLabel}>Classificação</Text>
                                <Text style={[styles.imcClassif, { color: corClass }]}>
                                    {classif}
                                </Text>
                                <Text style={styles.imcFormula}>
                                    {pesoAtual} kg ÷ ({(perfil.altura! / 100).toFixed(2)} m)²
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {imc === null && (
                    <Text style={styles.dicaIMC}>
                        Preencha sua altura e registre seu peso para ver o IMC.
                    </Text>
                )}

                {/* CARD PESO ATUAL */}
                <Text style={styles.section}>Peso atual</Text>
                <View style={styles.cardPesoAtual}>
                    <Ionicons name="scale-outline" size={32} color="#ffffff" />
                    <View style={styles.cardPesoInfo}>
                        <Text style={styles.cardPesoLabel}>
                            {pesoAtual !== null ? "Último registro" : "Sem registros"}
                        </Text>
                        <Text style={styles.cardPesoValor}>
                            {pesoAtual !== null ? pesoAtual + " kg" : "—"}
                        </Text>
                    </View>
                    {variacao !== null && variacao !== 0 && (
                        <View style={styles.badgeVariacao}>
                            <Ionicons
                                name={variacao > 0 ? "trending-up" : "trending-down"}
                                size={14}
                                color={variacao > 0 ? "#ff9d4d" : "#4dff9d"}
                            />
                            <Text
                                style={[
                                    styles.badgeVariacaoTexto,
                                    { color: variacao > 0 ? "#ff9d4d" : "#4dff9d" },
                                ]}
                            >
                                {variacao > 0 ? "+" : ""}
                                {variacao.toFixed(1)} kg
                            </Text>
                        </View>
                    )}
                </View>

                {/* INPUT REGISTRAR NOVO PESO */}
                <Text style={styles.label}>Registrar peso de hoje (kg)</Text>
                <View style={styles.linhaInputPeso}>
                    <TextInput
                        style={styles.inputPeso}
                        placeholder="Ex: 75.5"
                        placeholderTextColor="#777"
                        keyboardType="numeric"
                        value={novoPeso}
                        onChangeText={setNovoPeso}
                    />
                    <TouchableOpacity style={styles.botaoSalvarPeso} onPress={salvarPeso}>
                        <Text style={styles.textoSalvarPeso}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                {/* GRAFICO DE EVOLUCAO */}
                {registros.length > 0 && (
                    <>
                        <Text style={styles.section}>Evolução</Text>
                        <GraficoLinha pontos={pontosGrafico} largura={larguraGrafico} />
                    </>
                )}

                {/* HISTORICO */}
                <Text style={styles.section}>Histórico ({registros.length})</Text>
                {/* FlatList vertical com os registros (Aula 6) */}
                <FlatList
                    data={registros}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
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
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.vazio}>
                            Nenhum registro de peso ainda.
                        </Text>
                    }
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: "#0f0f14" },
    container: { flex: 1, backgroundColor: "#0f0f14" },
    scrollContent: { padding: 16, paddingBottom: 32 },
    section: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
        marginTop: 18,
        marginBottom: 8,
    },
    cardPerfil: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
    },
    linhaCampos: { flexDirection: "row", gap: 10, marginBottom: 12 },
    campo: { flex: 1 },
    campoLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
        marginBottom: 6,
    },
    campoInput: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 18,
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: "center",
    },
    botaoPerfil: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },
    textoBotaoPerfil: {
        fontFamily: "Inter_600SemiBold",
        color: "#000000",
        fontSize: 14,
    },
    cardIMC: {
        backgroundColor: "#1c1c24",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    imcEsquerda: { alignItems: "center" },
    imcValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 36,
    },
    imcUnidade: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 11,
    },
    imcDireita: { flex: 1 },
    imcLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 11,
    },
    imcClassif: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        marginTop: 2,
    },
    imcFormula: {
        fontFamily: "Inter_400Regular",
        color: "#666",
        fontSize: 11,
        marginTop: 6,
    },
    dicaIMC: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
        marginTop: 6,
        marginBottom: 4,
        fontStyle: "italic",
    },
    cardPesoAtual: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cardPesoInfo: { flex: 1 },
    cardPesoLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
    },
    cardPesoValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 22,
    },
    badgeVariacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#2a2a35",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeVariacaoTexto: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
    },
    label: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 14,
        marginBottom: 6,
        marginTop: 14,
    },
    linhaInputPeso: { flexDirection: "row", gap: 10 },
    inputPeso: {
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
    botaoSalvarPeso: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 18,
        justifyContent: "center",
        borderRadius: 10,
    },
    textoSalvarPeso: { fontFamily: "Inter_600SemiBold", color: "#000000" },
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
    regPeso: { fontFamily: "Inter_600SemiBold", color: "#ffffff", fontSize: 16 },
    regData: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 2,
    },
    botaoRemover: { padding: 6 },
    vazio: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        textAlign: "center",
        marginTop: 12,
    },
})
