import { Text, TouchableOpacity, StyleSheet } from "react-native"

type BotaopProps = {
    textop: string
}

const Botaop = (props: BotaopProps) => {
    return (
        <TouchableOpacity>
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
    },
})
