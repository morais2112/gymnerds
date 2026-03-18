import React from "react";
import { StyleSheet, TextInput } from "react-native";

const InputSenha = () => {
    return ( 
        <TextInput
            placeholder="Digite sua senha" 
            placeholderTextColor="#ffffff" 
            secureTextEntry={true}         
            style={styles.inputSenha}           
        />
    );
};

export default InputSenha;

const styles = StyleSheet.create({
    inputSenha: {
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