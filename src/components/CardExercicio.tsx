import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Exercicio } from "../types"
import { labelArea } from "../data/labelsArea"
import BodySilhueta from "./BodySilhueta"

type CardExercicioProps = {
    exercicio: Exercicio
    onPress?: (exercicio: Exercicio) => void
    selecionado?: boolean
}

const CardExercicio = (props: CardExercicioProps) => {
    return (
        <TouchableOpacity
            style={[styles.card, props.selecionado && styles.cardSelecionado]}
            onPress={() => props.onPress && props.onPress(props.exercicio)}
        >
            <View style={styles.iconeBox}>
                <BodySilhueta area={props.exercicio.area} size={28} />
            </View>
            <View style={styles.info}>
                <Text style={styles.nome} numberOfLines={1}>
                    {props.exercicio.nome}
                </Text>
                <Text style={styles.area}>{labelArea(props.exercicio.area)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CardExercicio

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1c1c24",
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cardSelecionado: {
        borderColor: "#ffffff",
        backgroundColor: "#2a2a35",
    },
    iconeBox: {
        width: 44,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#2a2a35",
        alignItems: "center",
        justifyContent: "center",
    },
    info: {
        flex: 1,
    },
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
    },
})
