import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ExercicioFicha } from "../types"
import { labelArea } from "../data/labelsArea"
import BodySilhueta from "./BodySilhueta"
import { useTheme } from "../theme/ThemeContext"

type CardExercicioFichaProps = {
    item: ExercicioFicha
    prAtual: number | null
    onRemover?: (idExercicio: string) => void
}

const CardExercicioFicha = (props: CardExercicioFichaProps) => {
    const { colors } = useTheme()

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            <View style={[styles.iconeBox, { backgroundColor: colors.surfaceAlt }]}>
                <BodySilhueta
                    area={props.item.exercicio.area}
                    size={28}
                    cor={colors.text}
                    corBase={colors.textDim}
                />
            </View>

            <View style={styles.info}>
                <Text style={[styles.nome, { color: colors.text }]} numberOfLines={1}>
                    {props.item.exercicio.nome}
                </Text>
                <Text style={[styles.area, { color: colors.textMuted }]}>
                    {labelArea(props.item.exercicio.area)}
                </Text>
                <View style={styles.metaLinha}>
                    <View style={styles.metaBox}>
                        <Text style={[styles.metaValor, { color: colors.text }]}>
                            {props.item.series}
                        </Text>
                        <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                            séries
                        </Text>
                    </View>
                    <Text style={[styles.metaX, { color: colors.textDim }]}>×</Text>
                    <View style={styles.metaBox}>
                        <Text style={[styles.metaValor, { color: colors.text }]}>
                            {props.item.repeticoes}
                        </Text>
                        <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                            reps
                        </Text>
                    </View>
                    {props.prAtual !== null && (
                        <>
                            <View
                                style={[styles.divisor, { backgroundColor: colors.border }]}
                            />
                            <View style={styles.metaBox}>
                                <Text style={[styles.metaValor, { color: colors.text }]}>
                                    {props.prAtual}
                                </Text>
                                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                                    kg PR
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </View>

            {props.onRemover && (
                <TouchableOpacity
                    onPress={() =>
                        props.onRemover && props.onRemover(props.item.exercicio.id)
                    }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.botaoRemover}
                >
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default CardExercicioFicha

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
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
    nome: { fontFamily: "Inter_600SemiBold", fontSize: 15, marginBottom: 2 },
    area: { fontFamily: "Inter_400Regular", fontSize: 12, marginBottom: 6 },
    metaLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
    metaBox: { flexDirection: "row", alignItems: "baseline", gap: 3 },
    metaValor: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
    metaLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
    metaX: { fontFamily: "Inter_400Regular", fontSize: 12 },
    divisor: { width: 1, height: 16, marginHorizontal: 4 },
    botaoRemover: { padding: 6 },
})
