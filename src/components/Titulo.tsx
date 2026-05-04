import React from "react"
import { View, Text, StyleSheet, useWindowDimensions } from "react-native"

const Titulo = () => {
    // useWindowDimensions atualiza automaticamente em mudanças de orientação/tela
    const { width } = useWindowDimensions()
    // Tamanho proporcional, com limites
    const fontSize = Math.min(Math.max(width * 0.12, 32), 56)

    return (
        <View>
            <Text style={[styles.titulo, { fontSize }]}>Login</Text>
        </View>
    )
}

export default Titulo

const styles = StyleSheet.create({
    titulo: {
        fontFamily: "Inter_400Regular",
        margin: 20,
        textAlign: "center",
        color: "#fcfcfc",
    },
})
