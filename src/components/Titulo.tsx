import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const titulo = () => {
    return <View>
                <Text style={styles.titulo}>Login</Text>
           </View>
}

export default titulo

const styles = StyleSheet.create({
    titulo: {
        fontFamily: 'Inter_400Regular',
        fontSize: 48,
        margin: 20,
        textAlign: "center",
        color: "#fcfcfc"
    },
    container:{
        backgroundColor: "#878686"
    }
})
