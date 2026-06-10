import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Ficha } from "../types"
import { useTheme } from "../theme/ThemeContext"

type CardFichaProps = {
    ficha: Ficha
    onPress?: (ficha: Ficha) => void
    onRemover?: (id: string) => void
}

const CardFicha = (props: CardFichaProps) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
            ]}
            onPress={() => props.onPress && props.onPress(props.ficha)}
        >
            <View style={styles.header}>
                <Text
                    style={[styles.nome, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {props.ficha.nome}
                </Text>
                {props.onRemover && (
                    <TouchableOpacity
                        onPress={() =>
                            props.onRemover && props.onRemover(props.ficha.id)
                        }
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={[styles.remover, { color: colors.danger }]}>
                            X
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={[styles.qtd, { color: colors.textMuted }]}>
                {props.ficha.exercicios.length} exercício(s)
            </Text>
        </TouchableOpacity>
    )
}

export default CardFicha

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        borderWidth: 1.5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        flex: 1,
        marginRight: 12,
    },
    qtd: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        marginTop: 6,
    },
    remover: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        paddingHorizontal: 8,
    },
})
