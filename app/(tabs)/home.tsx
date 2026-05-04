import { useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Ficha } from "../../src/types"
import { getFichas, subscribe } from "../../src/data/fichasStore"

export default function Home() {
    const { width } = useWindowDimensions()

    // useState com a lista de fichas exibida na home
    const [fichas, setFichas] = useState<Ficha[]>(getFichas())

    useEffect(() => {
        const unsub = subscribe(() => setFichas([...getFichas()]))
        return unsub
    }, [])

    // Cálculos responsivos
    const cardWidth = Math.min(Math.max(width * 0.4, 130), 180)
    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingH }]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.saudacao}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitulo}>
                Você tem {fichas.length} ficha(s) cadastrada(s)
            </Text>

            <View style={styles.linhaSection}>
                <Text style={styles.section}>Suas fichas</Text>
                <TouchableOpacity onPress={() => router.push("/fichas")}>
                    <Text style={styles.verTodas}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            {/* FlatList horizontal com as fichas como cards */}
            <FlatList
                data={fichas}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listaCards}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.cardFicha, { width: cardWidth }]}
                        onPress={() =>
                            router.push({
                                pathname: "/criarFicha",
                                params: { idFicha: item.id },
                            })
                        }
                    >
                        <Ionicons name="clipboard" size={24} color="#ffffff" />
                        <Text style={styles.cardNome} numberOfLines={2}>
                            {item.nome}
                        </Text>
                        <Text style={styles.cardQtd}>
                            {item.exercicios.length} ex.
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={[styles.cardVazio, { width: cardWidth * 1.4 }]}>
                        <Text style={styles.cardVazioTexto}>
                            Sem fichas ainda
                        </Text>
                        <TouchableOpacity
                            style={styles.botaoCriar}
                            onPress={() => router.push("/criarFicha")}
                        >
                            <Text style={styles.botaoCriarTexto}>+ Criar</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            <View style={styles.linhaSection}>
                <Text style={styles.section}>Ações rápidas</Text>
            </View>

            <View style={styles.acoesRapidas}>
                <TouchableOpacity
                    style={styles.botaoAcao}
                    onPress={() => router.push("/criarFicha")}
                >
                    <Ionicons name="add-circle-outline" size={26} color="#ffffff" />
                    <Text style={styles.botaoAcaoTexto}>Nova ficha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoAcao}
                    onPress={() => router.push("/exercicios")}
                >
                    <Ionicons name="trophy-outline" size={26} color="#ffffff" />
                    <Text style={styles.botaoAcaoTexto}>Registrar PR</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f14",
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    saudacao: {
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
    linhaSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
    },
    section: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
    },
    verTodas: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 13,
    },
    listaCards: {
        gap: 12,
        paddingVertical: 4,
        paddingRight: 4,
    },
    cardFicha: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        height: 130,
        justifyContent: "space-between",
    },
    cardNome: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 14,
    },
    cardQtd: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 12,
    },
    cardVazio: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        height: 130,
        alignItems: "center",
        justifyContent: "center",
    },
    cardVazioTexto: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        marginBottom: 8,
        fontSize: 13,
    },
    botaoCriar: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    botaoCriarTexto: {
        fontFamily: "Inter_600SemiBold",
        color: "#000000",
        fontSize: 13,
    },
    acoesRapidas: {
        flexDirection: "row",
        gap: 12,
    },
    botaoAcao: {
        flex: 1,
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        gap: 6,
    },
    botaoAcaoTexto: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 13,
    },
})
