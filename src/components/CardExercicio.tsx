import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Exercicio } from "../types"
import { labelArea } from "../data/labelsArea"
import BodySilhueta from "./BodySilhueta"
import { useTheme } from "../theme/ThemeContext"

type CardExercicioProps = {
    exercicio: Exercicio
    onPress?: (exercicio: Exercicio) => void
    selecionado?: boolean
}

const CardExercicio = (props: CardExercicioProps) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: props.selecionado ? colors.text : colors.border,
                },
            ]}
            onPress={() => props.onPress && props.onPress(props.exercicio)}
        >
            <View style={[styles.iconeBox, { backgroundColor: colors.surfaceAlt }]}>
                <BodySilhueta
                    area={props.exercicio.area}
                    size={28}
                    cor={colors.text}
                    corBase={colors.textDim}
                />
            </View>
            <View style={styles.info}>
                <Text
                    style={[styles.nome, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {props.exercicio.nome}
                </Text>
                <Text style={[styles.area, { color: colors.textMuted }]}>
                    {labelArea(props.exercicio.area)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default CardExercicio

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        borderWidth: 1.5,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconeBox: {
        width: 44,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    info: { flex: 1 },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        marginBottom: 2,
    },
    area: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
    },
})
