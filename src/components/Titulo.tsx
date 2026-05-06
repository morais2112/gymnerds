import React from "react"
import { View, Text, StyleSheet, useWindowDimensions } from "react-native"

type TituloProps = {
    texto?: string
}

const Titulo = (props: TituloProps) => {
    const { width } = useWindowDimensions()
    const fontSize = Math.min(Math.max(width * 0.12, 32), 56)

    return (
        <View>
            <Text style={[styles.titulo, { fontSize }]}>
                {props.texto ?? "Login"}
            </Text>
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
