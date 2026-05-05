import { TouchableOpacity, Text, StyleSheet } from "react-native"

type BotaoProps = {
    textoQ?: string
}

const Botao = (props: BotaoProps) => {
    return (
        <TouchableOpacity>
            <Text style={styles.botao}>{props.textoQ}</Text>
        </TouchableOpacity>
    )
}

export default Botao

const styles = StyleSheet.create({
    botao: {
        fontFamily: "Inter_400Regular",
        margin: 10,
        textAlign: "center",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 10,
    },
})
