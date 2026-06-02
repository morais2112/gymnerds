import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ExercicioFicha } from "../types"
import { labelArea } from "../data/labelsArea"
import BodySilhueta from "./BodySilhueta"

type CardExercicioFichaProps = {
    item: ExercicioFicha
    prAtual: number | null
    onRemover?: (idExercicio: string) => void
}

const CardExercicioFicha = (props: CardExercicioFichaProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconeBox}>
                <BodySilhueta area={props.item.exercicio.area} size={28} />
            </View>

            <View style={styles.info}>
                <Text style={styles.nome} numberOfLines={1}>
                    {props.item.exercicio.nome}
                </Text>
                <Text style={styles.area}>
                    {labelArea(props.item.exercicio.area)}
                </Text>
                <View style={styles.metaLinha}>
                    <View style={styles.metaBox}>
                        <Text style={styles.metaValor}>{props.item.series}</Text>
                        <Text style={styles.metaLabel}>séries</Text>
                    </View>
                    <Text style={styles.metaX}>×</Text>
                    <View style={styles.metaBox}>
                        <Text style={styles.metaValor}>{props.item.repeticoes}</Text>
                        <Text style={styles.metaLabel}>reps</Text>
                    </View>
                    {props.prAtual !== null && (
                        <>
                            <View style={styles.divisor} />
                            <View style={styles.metaBox}>
                                <Text style={styles.metaValor}>{props.prAtual}</Text>
                                <Text style={styles.metaLabel}>kg PR</Text>
                            </View>
                        </>
                    )}
                </View>
            </View>

            {props.onRemover && (
                <TouchableOpacity
                    onPress={() => props.onRemover && props.onRemover(props.item.exercicio.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.botaoRemover}
                >
                    <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default CardExercicioFicha

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconeBox: {
        width: 44,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#2a2a35",
        alignItems: "center",
        justifyContent: "center",
    },
    info: { flex: 1 },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        color: "#ffffff",
        marginBottom: 2,
    },
    area: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        color: "#aaaaaa",
        marginBottom: 6,
    },
    metaLinha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    metaBox: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 3,
    },
    metaValor: {
        fontFamily: "Inter_600SemiBold",
        color: "#ffffff",
        fontSize: 14,
    },
    metaLabel: {
        fontFamily: "Inter_400Regular",
        color: "#aaaaaa",
        fontSize: 11,
    },
    metaX: {
        fontFamily: "Inter_400Regular",
        color: "#666",
        fontSize: 12,
    },
    divisor: {
        width: 1,
        height: 16,
        backgroundColor: "#2a2a35",
        marginHorizontal: 4,
    },
    botaoRemover: {
        padding: 6,
    },
})
