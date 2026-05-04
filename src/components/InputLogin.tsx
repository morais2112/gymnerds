import { TextInput, StyleSheet } from "react-native"

const InputLogin = () => {
    return (
        <TextInput
            placeholder="Digite seu login"
            placeholderTextColor="#777"
            style={styles.inputLogin}
        />
    )
}

export default InputLogin

const styles = StyleSheet.create({
    inputLogin: {
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
