import { TextInput, StyleSheet } from "react-native"

const InputCadastroLogin = () => {
    return (
        <TextInput
            placeholder="Cadastre seu login"
            placeholderTextColor="#777"
            style={styles.inputCadastroLogin}
        />
    )
}

export default InputCadastroLogin

const styles = StyleSheet.create({
    inputCadastroLogin: {
        fontFamily: "Inter_400Regular",
        width: "85%",
        maxWidth: 420,
        height: 44,
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 9,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 10,
        color: "#ffffff",
    },
})
