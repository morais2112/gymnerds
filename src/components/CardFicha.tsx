import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import { Ficha } from "../types"

// Props tipadas
type CardFichaProps = {
    ficha: Ficha
    onPress?: (ficha: Ficha) => void
    onRemover?: (id: string) => void
}

const CardFicha = (props: CardFichaProps) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => props.onPress && props.onPress(props.ficha)}
        >
            <View style={styles.header}>
                <Text style={styles.nome} numberOfLines={1}>
                    {props.ficha.nome}
                </Text>
                {props.onRemover && (
                    <TouchableOpacity
                        onPress={() => props.onRemover && props.onRemover(props.ficha.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.remover}>X</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.qtd}>
                {props.ficha.exercicios.length} exercício(s)
            </Text>
        </TouchableOpacity>
    )
}

export default CardFicha

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        borderWidth: 1.5,
        borderColor: "#2a2a35",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    nome: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        color: "#ffffff",
        flex: 1,
        marginRight: 12,
    },
    qtd: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        color: "#aaaaaa",
        marginTop: 6,
    },
    remover: {
        fontFamily: "Inter_600SemiBold",
        color: "#ff4d4d",
        fontSize: 14,
        paddingHorizontal: 8,
    },
})
