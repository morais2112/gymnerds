import { useState, useMemo } from "react"
import { StyleSheet, Text, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import CardExercicio from "../src/components/CardExercicio"
import FiltroArea from "../src/components/FiltroArea"
import { AreaMuscular, Exercicio } from "../src/types"
import { exercicios, areasMusculares } from "../src/data/exercicios"
import { addExercicioNaFicha } from "../src/data/fichasStore"

export default function SelecionarExercicio() {
    // useLocalSearchParams - lê o id da ficha que está sendo editada
    const params = useLocalSearchParams<{ idFicha?: string }>()

    // useState para a área muscular selecionada
    const [areaSelecionada, setAreaSelecionada] = useState<AreaMuscular | null>(
        null
    )

    // Filtra a lista de exercícios pela área escolhida
    const lista: Exercicio[] = useMemo(() => {
        if (!areaSelecionada) return exercicios
        return exercicios.filter((e) => e.area === areaSelecionada)
    }, [areaSelecionada])

    // Adiciona o exercício escolhido na ficha e volta
    const escolher = (ex: Exercicio) => {
        if (params.idFicha) {
            addExercicioNaFicha(params.idFicha, ex)
        }
        router.back()
    }

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Text style={styles.titulo}>Filtrar por área muscular</Text>

            <FiltroArea
                areas={areasMusculares}
                areaSelecionada={areaSelecionada}
                onSelecionar={setAreaSelecionada}
            />

            <Text style={styles.subtitulo}>
                {lista.length} exercício(s){" "}
                {areaSelecionada ? `em ${areaSelecionada}` : "no total"}
            </Text>

            {/* FlatList renderiza os exercícios filtrados */}
            <FlatList
                data={lista}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CardExercicio exercicio={item} onPress={escolher} />
                )}
                ListEmptyComponent={
                    <Text style={styles.vazio}>
                        Nenhum exercício para essa área.
                    </Text>
                }
                contentContainerStyle={styles.listaConteudo}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f14",
        paddingTop: 8,
    },
    titulo: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 16,
        marginHorizontal: 16,
        marginTop: 6,
    },
    subtitulo: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 8,
        fontSize: 12,
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
})
