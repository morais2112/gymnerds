import React from "react";
import { StyleSheet, TextInput } from "react-native";

const InputCadastroSenha = () => {
    return ( 
        <TextInput
            placeholder="Digite sua senha" 
            placeholderTextColor="#ffffff" 
            secureTextEntry={true}         
            style={styles.inputCadastroSenha}           
        />
    );
};

export default InputCadastroSenha;

const styles = StyleSheet.create({
    inputCadastroSenha: {
        fontFamily: 'Inter_400Regular',
        width: 300,
        height: 40,
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 9,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
        color: "#ffffff"
    }
});