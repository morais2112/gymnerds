import { TouchableOpacity, Text, StyleSheet } from "react-native"

const BotaoC = () => {
    return (
        <TouchableOpacity>
            <Text style={styles.botao}>Cadastrar</Text>
        </TouchableOpacity>
    )
}

export default BotaoC

const styles = StyleSheet.create({
    botao: {
        fontFamily: "Inter_400Regular",
        fontSize: 20,
        margin: 10,
        textAlign: "center",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 15,
    },
})
