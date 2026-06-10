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
import { useTheme } from "../../src/theme/ThemeContext"
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
import { calcularIMC, classificarIMC, corClassificacao } from "../../src/data/imcCalc"
import GraficoLinha from "../../src/components/GraficoLinha"

export default function MeusDados() {
    const { width } = useWindowDimensions()
    const { mode, colors, toggleTheme } = useTheme()

    const [novoPeso, setNovoPeso] = useState<string>("")
    const [registros, setRegistros] = useState<RegistroPeso[]>(getRegistros())
    const [perfil, setPerfilLocal] = useState<Perfil>(getPerfil())
    const [alturaInput, setAlturaInput] = useState<string>(
        perfil.altura !== null ? String(perfil.altura) : ""
    )
    const [idadeInput, setIdadeInput] = useState<string>(
        perfil.idade !== null ? String(perfil.idade) : ""
    )

    useEffect(() => {
        const unsubW = subPesos(() => setRegistros(getRegistros()))
        const unsubP = subPerfil(() => {
            const p = getPerfil()
            setPerfilLocal(p)
            setAlturaInput(p.altura !== null ? String(p.altura) : "")
            setIdadeInput(p.idade !== null ? String(p.idade) : "")
        })
        return () => { unsubW(); unsubP() }
    }, [])

    const pesoAtual = getPesoAtual()
    const pesoInicial = getPesoInicial()
    const variacao = pesoAtual !== null && pesoInicial !== null ? pesoAtual - pesoInicial : null
    const imc = calcularIMC(pesoAtual, perfil.altura)
    const classif = imc !== null ? classificarIMC(imc) : null
    const corClass = classif ? corClassificacao(classif) : colors.textMuted

    const formatarData = (iso: string): string => {
        const d = new Date(iso)
        return String(d.getDate()).padStart(2, "0") + "/" +
               String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear()
    }

    const labelData = (iso: string): string => {
        const d = new Date(iso)
        return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0")
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
    const cardStyle = { backgroundColor: colors.surface, borderColor: colors.border }

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.background }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* CARD APARENCIA */}
                <Text style={[styles.section, { color: colors.text }]}>Aparência</Text>
                <TouchableOpacity
                    style={[styles.cardTema, cardStyle]}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                >
                    <View style={styles.temaEsquerda}>
                        <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={26} color={colors.text} />
                        <View>
                            <Text style={[styles.temaTitulo, { color: colors.text }]}>
                                {mode === "dark" ? "Modo escuro" : "Modo claro"}
                            </Text>
                            <Text style={[styles.temaSub, { color: colors.textMuted }]}>
                                Toque para alternar
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.switchTrack,
                            { backgroundColor: mode === "dark" ? colors.surfaceAlt : colors.accent },
                        ]}
                    >
                        <View
                            style={[
                                styles.switchKnob,
                                {
                                    backgroundColor: colors.text,
                                    transform: [{ translateX: mode === "dark" ? 2 : 22 }],
                                },
                            ]}
                        />
                    </View>
                </TouchableOpacity>

                {/* CARD PERFIL */}
                <Text style={[styles.section, { color: colors.text }]}>Perfil</Text>
                <View style={[styles.cardPerfil, cardStyle]}>
                    <View style={styles.linhaCampos}>
                        <View style={styles.campo}>
                            <Text style={[styles.campoLabel, { color: colors.textMuted }]}>
                                Altura (cm)
                            </Text>
                            <TextInput
                                style={[styles.campoInput, { color: colors.text, borderColor: colors.text }]}
                                placeholder="Ex: 175"
                                placeholderTextColor={colors.textDim}
                                keyboardType="numeric"
                                value={alturaInput}
                                onChangeText={setAlturaInput}
                                maxLength={5}
                            />
                        </View>
                        <View style={styles.campo}>
                            <Text style={[styles.campoLabel, { color: colors.textMuted }]}>
                                Idade
                            </Text>
                            <TextInput
                                style={[styles.campoInput, { color: colors.text, borderColor: colors.text }]}
                                placeholder="Ex: 25"
                                placeholderTextColor={colors.textDim}
                                keyboardType="numeric"
                                value={idadeInput}
                                onChangeText={setIdadeInput}
                                maxLength={3}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.botaoPerfil, { backgroundColor: colors.accent }]}
                        onPress={salvarPerfil}
                    >
                        <Text style={[styles.textoBotaoPerfil, { color: colors.accentText }]}>
                            Salvar perfil
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CARD IMC */}
                {imc !== null && classif && (
                    <>
                        <Text style={[styles.section, { color: colors.text }]}>IMC</Text>
                        <View
                            style={[
                                styles.cardIMC,
                                { backgroundColor: colors.surface, borderColor: corClass },
                            ]}
                        >
                            <View style={styles.imcEsquerda}>
                                <Text style={[styles.imcValor, { color: colors.text }]}>
                                    {imc.toFixed(1)}
                                </Text>
                                <Text style={[styles.imcUnidade, { color: colors.textMuted }]}>
                                    kg/m²
                                </Text>
                            </View>
                            <View style={styles.imcDireita}>
                                <Text style={[styles.imcLabel, { color: colors.textMuted }]}>
                                    Classificação
                                </Text>
                                <Text style={[styles.imcClassif, { color: corClass }]}>
                                    {classif}
                                </Text>
                                <Text style={[styles.imcFormula, { color: colors.textDim }]}>
                                    {pesoAtual} kg ÷ ({(perfil.altura! / 100).toFixed(2)} m)²
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {imc === null && (
                    <Text style={[styles.dicaIMC, { color: colors.textMuted }]}>
                        Preencha sua altura e registre seu peso para ver o IMC.
                    </Text>
                )}

                {/* CARD PESO ATUAL */}
                <Text style={[styles.section, { color: colors.text }]}>Peso atual</Text>
                <View style={[styles.cardPesoAtual, cardStyle]}>
                    <Ionicons name="scale-outline" size={32} color={colors.text} />
                    <View style={styles.cardPesoInfo}>
                        <Text style={[styles.cardPesoLabel, { color: colors.textMuted }]}>
                            {pesoAtual !== null ? "Último registro" : "Sem registros"}
                        </Text>
                        <Text style={[styles.cardPesoValor, { color: colors.text }]}>
                            {pesoAtual !== null ? pesoAtual + " kg" : "—"}
                        </Text>
                    </View>
                    {variacao !== null && variacao !== 0 && (
                        <View
                            style={[
                                styles.badgeVariacao,
                                { backgroundColor: colors.surfaceAlt },
                            ]}
                        >
                            <Ionicons
                                name={variacao > 0 ? "trending-up" : "trending-down"}
                                size={14}
                                color={variacao > 0 ? colors.warning : colors.success}
                            />
                            <Text
                                style={[
                                    styles.badgeVariacaoTexto,
                                    { color: variacao > 0 ? colors.warning : colors.success },
                                ]}
                            >
                                {variacao > 0 ? "+" : ""}
                                {variacao.toFixed(1)} kg
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.label, { color: colors.text }]}>
                    Registrar peso de hoje (kg)
                </Text>
                <View style={styles.linhaInputPeso}>
                    <TextInput
                        style={[styles.inputPeso, { color: colors.text, borderColor: colors.text }]}
                        placeholder="Ex: 75.5"
                        placeholderTextColor={colors.textDim}
                        keyboardType="numeric"
                        value={novoPeso}
                        onChangeText={setNovoPeso}
                    />
                    <TouchableOpacity
                        style={[styles.botaoSalvarPeso, { backgroundColor: colors.accent }]}
                        onPress={salvarPeso}
                    >
                        <Text style={[styles.textoSalvarPeso, { color: colors.accentText }]}>
                            Salvar
                        </Text>
                    </TouchableOpacity>
                </View>

                {registros.length > 0 && (
                    <>
                        <Text style={[styles.section, { color: colors.text }]}>Evolução</Text>
                        <GraficoLinha pontos={pontosGrafico} largura={larguraGrafico} cor={colors.text} />
                    </>
                )}

                <Text style={[styles.section, { color: colors.text }]}>
                    Histórico ({registros.length})
                </Text>
                <FlatList
                    data={registros}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={[styles.cardRegistro, cardStyle]}>
                            <View>
                                <Text style={[styles.regPeso, { color: colors.text }]}>
                                    {item.peso} kg
                                </Text>
                                <Text style={[styles.regData, { color: colors.textMuted }]}>
                                    {formatarData(item.data)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => removeRegistro(item.id)}
                                style={styles.botaoRemover}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={[styles.vazio, { color: colors.textMuted }]}>
                            Nenhum registro de peso ainda.
                        </Text>
                    }
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32 },
    section: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginTop: 18, marginBottom: 8 },
    cardTema: { borderWidth: 1.5, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    temaEsquerda: { flexDirection: "row", alignItems: "center", gap: 12 },
    temaTitulo: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
    temaSub: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
    switchTrack: { width: 44, height: 24, borderRadius: 12, justifyContent: "center" },
    switchKnob: { width: 20, height: 20, borderRadius: 10 },
    cardPerfil: { borderWidth: 1.5, borderRadius: 12, padding: 14 },
    linhaCampos: { flexDirection: "row", gap: 10, marginBottom: 12 },
    campo: { flex: 1 },
    campoLabel: { fontFamily: "Inter_400Regular", fontSize: 12, marginBottom: 6 },
    campoInput: { fontFamily: "Inter_600SemiBold", fontSize: 18, borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, textAlign: "center" },
    botaoPerfil: { borderRadius: 10, paddingVertical: 10, alignItems: "center" },
    textoBotaoPerfil: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
    cardIMC: { borderWidth: 1.5, borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", gap: 16 },
    imcEsquerda: { alignItems: "center" },
    imcValor: { fontFamily: "Inter_600SemiBold", fontSize: 36 },
    imcUnidade: { fontFamily: "Inter_400Regular", fontSize: 11 },
    imcDireita: { flex: 1 },
    imcLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
    imcClassif: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginTop: 2 },
    imcFormula: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 6 },
    dicaIMC: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 6, marginBottom: 4, fontStyle: "italic" },
    cardPesoAtual: { borderWidth: 1.5, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
    cardPesoInfo: { flex: 1 },
    cardPesoLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
    cardPesoValor: { fontFamily: "Inter_600SemiBold", fontSize: 22 },
    badgeVariacao: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    badgeVariacaoTexto: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
    label: { fontFamily: "Inter_600SemiBold", fontSize: 14, marginBottom: 6, marginTop: 14 },
    linhaInputPeso: { flexDirection: "row", gap: 10 },
    inputPeso: { flex: 1, fontFamily: "Inter_400Regular", borderWidth: 1.5, borderRadius: 9, paddingHorizontal: 12, height: 44, fontSize: 15 },
    botaoSalvarPeso: { paddingHorizontal: 18, justifyContent: "center", borderRadius: 10 },
    textoSalvarPeso: { fontFamily: "Inter_600SemiBold" },
    cardRegistro: { borderWidth: 1.5, borderRadius: 10, padding: 12, marginVertical: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    regPeso: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    regData: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    botaoRemover: { padding: 6 },
    vazio: { fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 12 },
})
