import React from "react"
import { StyleSheet, TextInput } from "react-native"

const InputSenha = () => {
    return (
        <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#777"
            secureTextEntry={true}
            style={styles.inputSenha}
        />
    )
}

export default InputSenha

const styles = StyleSheet.create({
    inputSenha: {
        fontFamily: "Inter_400Regular",
        width: "85%",
        maxWidth: 420,
        height: 44,
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 9,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 20,
        color: "#ffffff",
    },
})
