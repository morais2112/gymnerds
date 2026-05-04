import { Text, TouchableOpacity, StyleSheet, ScrollView, View } from "react-native"
import { AreaMuscular } from "../types"

// Props tipadas
type FiltroAreaProps = {
    areas: AreaMuscular[]
    areaSelecionada: AreaMuscular | null
    onSelecionar: (area: AreaMuscular | null) => void
}

const FiltroArea = (props: FiltroAreaProps) => {
    // Monta um array com a opção "Todos" no início + todas as áreas
    const opcoes: (AreaMuscular | "Todos")[] = ["Todos", ...props.areas]

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {opcoes.map((item) => {
                    const ativo =
                        (item === "Todos" && props.areaSelecionada === null) ||
                        item === props.areaSelecionada
                    return (
                        <TouchableOpacity
                            key={item}
                            style={[styles.botao, ativo && styles.botaoAtivo]}
                            onPress={() =>
                                props.onSelecionar(
                                    item === "Todos" ? null : (item as AreaMuscular)
                                )
                            }
                        >
                            <Text style={[styles.texto, ativo && styles.textoAtivo]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default FiltroArea

const styles = StyleSheet.create({
    // Wrapper com altura fixa para o filtro não colapsar
    wrapper: {
        height: 56,
    },
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
    },
    botao: {
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
    },
    botaoAtivo: {
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
    },
    texto: {
        fontFamily: "Inter_400Regular",
        color: "#ffffff",
        fontSize: 13,
    },
    textoAtivo: {
        color: "#000000",
        fontFamily: "Inter_600SemiBold",
    },
})
