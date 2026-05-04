import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Exercicio } from "../types"

// Props tipadas do componente
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
            <View>
                <Text style={styles.nome} numberOfLines={1}>
                    {props.exercicio.nome}
                </Text>
                <Text style={styles.area}>{props.exercicio.area}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CardExercicio

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1c1c24",
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
        marginHorizontal: 12,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
    },
    cardSelecionado: {
        borderColor: "#ffffff",
        backgroundColor: "#2a2a35",
    },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
        color: "#ffffff",
        marginBottom: 4,
    },
    area: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        color: "#aaaaaa",
    },
})
