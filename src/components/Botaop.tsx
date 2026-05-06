import { Text, TouchableOpacity, StyleSheet } from "react-native"

type BotaopProps = {
    textop: string
    onPress?: () => void
}

const Botaop = (props: BotaopProps) => {
    return (
        <TouchableOpacity onPress={props.onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.botao}>{props.textop}</Text>
        </TouchableOpacity>
    )
}

export default Botaop

const styles = StyleSheet.create({
    botao: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        color: "#fcfcfc",
        margin: 20,
        fontSize: 14,
        textDecorationLine: "underline",
    },
})
