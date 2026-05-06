import { Text, TouchableOpacity, StyleSheet, ScrollView, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AreaMuscular } from "../types"
import { labelArea } from "../data/labelsArea"
import BodySilhueta from "./BodySilhueta"

type FiltroAreaProps = {
    areas: AreaMuscular[]
    areaSelecionada: AreaMuscular | null
    onSelecionar: (area: AreaMuscular | null) => void
}

const FiltroArea = (props: FiltroAreaProps) => {
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Botao Todos - usa Ionicons (nao e grupo muscular) */}
                <TouchableOpacity
                    style={[styles.botao, props.areaSelecionada === null && styles.botaoAtivo]}
                    onPress={() => props.onSelecionar(null)}
                >
                    <Ionicons
                        name="apps-outline"
                        size={14}
                        color={props.areaSelecionada === null ? "#000000" : "#ffffff"}
                    />
                    <Text style={[styles.texto, props.areaSelecionada === null && styles.textoAtivo]}>
                        Todos
                    </Text>
                </TouchableOpacity>

                {/* Botoes de areas - silhueta de corpo destacando o musculo */}
                {props.areas.map((area) => {
                    const ativo = area === props.areaSelecionada
                    return (
                        <TouchableOpacity
                            key={area}
                            style={[styles.botao, ativo && styles.botaoAtivo]}
                            onPress={() => props.onSelecionar(area)}
                        >
                            <BodySilhueta
                                area={area}
                                size={18}
                                cor={ativo ? "#000000" : "#ffffff"}
                                corBase={ativo ? "#aaaaaa" : "#555"}
                            />
                            <Text style={[styles.texto, ativo && styles.textoAtivo]}>
                                {labelArea(area)}
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
    wrapper: {
        height: 60,
    },
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
    },
    botao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#1c1c24",
        borderColor: "#2a2a35",
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
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
