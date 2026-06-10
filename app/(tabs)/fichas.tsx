import { useEffect, useState } from "react"
import {
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native"
import { router } from "expo-router"
import CardFicha from "../../src/components/CardFicha"
import { Ficha } from "../../src/types"
import { getFichas, removeFicha, subscribe } from "../../src/data/fichasStore"
import { useTheme } from "../../src/theme/ThemeContext"

export default function Fichas() {
    const { width } = useWindowDimensions()
    const { colors } = useTheme()

    const [fichas, setFichas] = useState<Ficha[]>(getFichas())

    useEffect(() => {
        const unsub = subscribe(() => setFichas([...getFichas()]))
        return unsub
    }, [])

    const paddingH = Math.max(12, Math.min(width * 0.04, 20))

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity
                style={[
                    styles.botaoCriar,
                    {
                        backgroundColor: colors.accent,
                        marginHorizontal: paddingH,
                    },
                ]}
                onPress={() => router.push("/criarFicha")}
            >
                <Text style={[styles.textoBotao, { color: colors.accentText }]}>
                    + Nova Ficha
                </Text>
            </TouchableOpacity>

            <FlatList
                data={fichas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: paddingH }}>
                        <CardFicha
                            ficha={item}
                            onPress={(f) =>
                                router.push({
                                    pathname: "/criarFicha",
                                    params: { idFicha: f.id },
                                })
                            }
                            onRemover={(id) => removeFicha(id)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <Text
                        style={[styles.vazio, { color: colors.textMuted }]}
                    >
                        Você ainda não tem nenhuma ficha. Crie a primeira!
                    </Text>
                }
                contentContainerStyle={[
                    styles.lista,
                    fichas.length === 0 && styles.listaVazia,
                ]}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 12 },
    botaoCriar: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 12,
    },
    textoBotao: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
    },
    vazio: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        fontSize: 14,
        paddingHorizontal: 24,
    },
    lista: { paddingBottom: 24 },
    listaVazia: { flex: 1, justifyContent: "center" },
})
