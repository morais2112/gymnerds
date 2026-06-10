import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "../theme/ThemeContext"

type BotaopProps = {
    textop: string
    onPress?: () => void
}

const Botaop = (props: BotaopProps) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            onPress={props.onPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            <Text style={[styles.botao, { color: colors.text }]}>{props.textop}</Text>
        </TouchableOpacity>
    )
}

export default Botaop

const styles = StyleSheet.create({
    botao: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        margin: 20,
        fontSize: 14,
        textDecorationLine: "underline",
    },
})
